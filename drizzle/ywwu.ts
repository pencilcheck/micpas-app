import { and, eq, not, sql } from "drizzle-orm";
import { pgMaterializedView } from "drizzle-orm/pg-core";
import { vwEducationUnits, vwMeetingAttendees, vwPersonCPALicenses, vwPersons, vwTopicCodeLinks } from "./schema";

export const educationVectors = pgMaterializedView('education_vectors')
  .using('columnar')
  .with({
    autovacuum_enabled: true,
  })
  .withNoData()
  .as((qb) => (
    qb.select({
      id: vwEducationUnits.PersonID,
      isThirdParty: sql`TRIM(${vwEducationUnits.Source}) = '3rd Party' AND ${vwEducationUnits.WebinarVendorID} IS NULL`.as('is_third_party'),
      macpa_creditdate: vwEducationUnits.MACPA_CreditDate,
      vector: sql`to_tsvector(${vwEducationUnits.ExternalSource})`.as('vector'),
    })
    .from(vwEducationUnits)
  ));

// support
export const attendedMeetingIdsLateral = pgMaterializedView('attended_meeting_ids_lateral')
  .using('columnar')
  .with({
    autovacuum_enabled: true,
  })
  .withNoData()
  .as((qb) => {
    return qb.select({
      id: vwMeetingAttendees.ID,
      attendedMeetingIds: sql`JSONB_AGG(${vwMeetingAttendees.ActualMeetingID})`.as('attended_meeting_ids'),
    })
    .from(vwMeetingAttendees)
    .groupBy(vwMeetingAttendees.ID);
  });

export const licensedStatesLateral = pgMaterializedView('licensed_states_lateral')
  .using('columnar')
  .with({
    autovacuum_enabled: true,
  })
  .withNoData()
  .as((qb) => {
    return qb.select({
      id: vwPersonCPALicenses.PersonID,
      licenseStates: sql`JSON_AGG(${vwPersonCPALicenses.LicenseState})`.as('license_states'),
    })
    .from(vwPersonCPALicenses)
    .groupBy(vwPersonCPALicenses.PersonID);
  });

export const topicCodesLateral = pgMaterializedView('topic_codes_lateral')
  .using('columnar')
  .with({
    autovacuum_enabled: true,
  })
  .withNoData()
  .as((qb) => {
    return qb.select({
      id: vwTopicCodeLinks.RecordID,
      topicCodes: sql`JSON_AGG(${vwTopicCodeLinks.TopicCodeID})`.as('topic_codes'),
    })
    .from(vwTopicCodeLinks)
    .where(
      eq(vwTopicCodeLinks.Status, 'Active')
    )
    .groupBy(vwTopicCodeLinks.RecordID);
  });



export const personsToReachOut = pgMaterializedView('persons_to_reach_out')
  .using('columnar')
  .with({
    autovacuum_enabled: true,
  })
  .withNoData()
  .as((qb) => {
    return qb.select({
      id: vwPersons.ID,
      firstName: vwPersons.FirstName,
      lastName: vwPersons.LastName,
      preferredAddress: vwPersons.PreferredAddress,
      company: vwPersons.Company,
      macpa_preferredAddressLine1: vwPersons.MACPA_PreferredAddressLine1,
      macpa_preferredAddressLine2: vwPersons.MACPA_PreferredAddressLine2,
      macpa_preferredAddressLine3: vwPersons.MACPA_PreferredAddressLine3,
      macpa_preferredAddressLine4: vwPersons.MACPA_PreferredAddressLine4,
      macpa_preferredCity: vwPersons.MACPA_PreferredCity,
      macpa_preferredState: vwPersons.MACPA_PreferredState,
      macpa_preferredZip: vwPersons.MACPA_PreferredZip,
      macpa_badgeName: vwPersons.MACPA_BadgeName,
      memberType: vwPersons.MemberType,
      email: vwPersons.Email,

      // for chart
      birthday: sql`${vwPersons.Birthday}::timestamp`.as('birthday'),

      // for filtering
      primaryFunction: vwPersons.PrimaryFunction,
      licenseStates: licensedStatesLateral.licenseStates,
      topicCodes: topicCodesLateral.topicCodes,
      homeState: vwPersons.HomeState,
      region: vwPersons.MACPA_Region,
      attendedMeetingIds: attendedMeetingIdsLateral.attendedMeetingIds,
    })
    .from(vwPersons)
    .leftJoin(attendedMeetingIdsLateral, eq(vwPersons.ID, attendedMeetingIdsLateral.id))
    .leftJoin(topicCodesLateral, eq(vwPersons.ID, topicCodesLateral.id))
    .leftJoin(licensedStatesLateral, eq(vwPersons.ID, licensedStatesLateral.id))
    .where(and(
      not(eq(vwPersons.Status, '5')) // exclude deceased persons
    ));
  });
