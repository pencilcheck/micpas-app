import { and, eq, gte, not, sql } from "drizzle-orm";
import { alias, pgMaterializedView } from "drizzle-orm/pg-core";
import { vwEducationUnits, vwMeetingAttendees, vwPersonCPALicenses, vwPersons, vwTopicCodeLinks } from "./schema";

export const educationVectors = pgMaterializedView('education_vectors')
  .with({
    autovacuum_enabled: true,
  })
  .withNoData()
  .as((qb) => (
    qb.select({
      id: vwEducationUnits.personid,
      isThirdParty: sql`TRIM(${vwEducationUnits.source}) = '3rd Party' AND ${vwEducationUnits.webinarvendorid} IS NULL`.as('is_third_party'),
      macpa_creditdate: vwEducationUnits.macpa_creditdate,
      vector: sql`to_tsvector(${vwEducationUnits.externalsource})`.as('vector'),
    })
    .from(vwEducationUnits)
  ));

// support
export const attendedMeetingIdsLateral = pgMaterializedView('attended_meeting_ids_lateral')
  .with({
    autovacuum_enabled: true,
  })
  .withNoData()
  .as((qb) => {
    return qb.select({
      id: vwMeetingAttendees.id,
      attendedMeetingIds: sql`JSONB_AGG(${vwMeetingAttendees.actualmeetingid})`.as('attended_meeting_ids'),
    })
    .from(vwMeetingAttendees)
    .groupBy(vwMeetingAttendees.id);
  });

export const licensedStatesLateral = pgMaterializedView('licensed_states_lateral')
  .with({
    autovacuum_enabled: true,
  })
  .withNoData()
  .as((qb) => {
    return qb.select({
      id: vwPersonCPALicenses.personid,
      licenseStates: sql`JSON_AGG(${vwPersonCPALicenses.licensestate})`.as('license_states'),
    })
    .from(vwPersonCPALicenses)
    .groupBy(vwPersonCPALicenses.personid);
  });

export const topicCodesLateral = pgMaterializedView('topic_codes_lateral')
  .with({
    autovacuum_enabled: true,
  })
  .withNoData()
  .as((qb) => {
    return qb.select({
      id: vwTopicCodeLinks.recordid,
      topicCodes: sql`JSON_AGG(${vwTopicCodeLinks.topiccodeid})`.as('topic_codes'),
    })
    .from(vwTopicCodeLinks)
    .where(
      eq(vwTopicCodeLinks.status, 'Active')
    )
    .groupBy(vwTopicCodeLinks.recordid);
  });



export const personsToReachOut = pgMaterializedView('persons_to_reach_out')
  .with({
    autovacuum_enabled: true,
  })
  .withNoData()
  .as((qb) => {
    return qb.select({
      id: vwPersons.id,
      firstName: vwPersons.firstname,
      lastName: vwPersons.lastname,
      preferredAddress: vwPersons.preferredaddress,
      company: vwPersons.company,
      macpa_preferredAddressLine1: vwPersons.macpa_preferredaddressline1,
      macpa_preferredAddressLine2: vwPersons.macpa_preferredaddressline2,
      macpa_preferredAddressLine3: vwPersons.macpa_preferredaddressline3,
      macpa_preferredAddressLine4: vwPersons.macpa_preferredaddressline4,
      macpa_preferredCity: vwPersons.macpa_preferredcity,
      macpa_preferredState: vwPersons.macpa_preferredstate,
      macpa_preferredZip: vwPersons.macpa_preferredzip,
      macpa_badgeName: vwPersons.macpa_badgename,
      memberType: vwPersons.membertype,
      email: vwPersons.email,

      // for filtering
      primaryFunction: vwPersons.primaryfunction,
      licenseStates: licensedStatesLateral.licenseStates,
      topicCodes: topicCodesLateral.topicCodes,
      homeState: vwPersons.homestate,
      region: vwPersons.macpa_region,
      attendedMeetingIds: attendedMeetingIdsLateral.attendedMeetingIds,
    })
    .from(vwPersons)
    .leftJoin(attendedMeetingIdsLateral, eq(vwPersons.id, attendedMeetingIdsLateral.id))
    .leftJoin(topicCodesLateral, eq(vwPersons.id, topicCodesLateral.id))
    .leftJoin(licensedStatesLateral, eq(vwPersons.id, licensedStatesLateral.id))
    .where(and(
      not(eq(vwPersons.status, 5)) // exclude deceased persons
    ));
  });
