import { alias, pgMaterializedView } from "drizzle-orm/pg-core";
import { vwMeetingAttendees, vwPersonCPALicenses, vwPersons } from "./schema";
import { and, eq, gte, not, sql } from "drizzle-orm";

const meetingParent = alias(vwMeetingAttendees, "meeting_parent")
export const personsToReachOut = pgMaterializedView('persons_to_reach_out')
  .with({
    autovacuum_enabled: true,
  })
  .withNoData()
  .as((qb) => (
    qb.select({
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
      licenseState: vwPersonCPALicenses.licensestate,
      homeState: vwPersons.homestate,
      region: vwPersons.macpa_region,
      attendedMeetingIds: sql`${
        qb.select({ ids: sql`JSONB_AGG(${meetingParent.actualmeetingid})` }).from(meetingParent).where(eq(vwPersons.id, meetingParent.id))
      }`.as('attended_meeting_ids'),
    })
    .from(vwPersons)
    .leftJoin(vwPersonCPALicenses, and(
      // TODO confirm this with Randy
      eq(vwPersons.id, vwPersonCPALicenses.personid),
      eq(vwPersonCPALicenses.licensestatusid, 6), // Licensed Accountant License
      eq(vwPersonCPALicenses.licensetypeid, 1), // CPE license
      gte(sql`${vwPersonCPALicenses.expirationdate}::timestamp`, sql`now()::timestamp`), // not expired
    ))
    .where(and(
      not(eq(vwPersons.status, 5)) // exclude deceased persons
    ))
  ));
