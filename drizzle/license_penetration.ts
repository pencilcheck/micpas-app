// TODO: https://orm.drizzle.team/kit-docs/upgrade-21#how-to-migrate-to-0210
import { asc, and, eq, getTableColumns, gte, isNull, lt, not, sql } from "drizzle-orm";
import { alias, getMaterializedViewConfig, numeric, pgMaterializedView, pgView, text, timestamp } from "drizzle-orm/pg-core";
import { db } from '../orm/local';

import { fiscalYearHalf, minFiscalYearString } from '../db/helper';
import { Orders, extendedAttributesOrder, minimumDateRangeConditions, orderCommonConditions, shipmentCommonConditions } from "./domain-rules";
import { vwEducationUnits, vwOrders, vwPersonCPALicenses, vwPersons, vwPersonsPartitions } from "./schema";

// --------- vwOrders: Shipments (orders with shipment) with order line backed up every 2 weeks or 1 month ---------- //
const { ...cols } = getTableColumns(vwPersonCPALicenses);

// {{{ Extended raw tables

// export const lastSequencePersonCPALicenses = pgMaterializedView('time_series_table', {
//   yearValue: numeric('year_value'),
//   orderStartMonthYear: timestamp('start_month_year'),
//   orderEndMonthYear: timestamp('end_month_year'),
//   memberTypeId: text('member_type_id'),
// })
// .using('columnar')
// .as(
//   sql`
//     select t1.*
//     from "vwPersonCPALicenses" as t1
//     left outer join "vwPersonCPALicenses" as t2
//         on t1."PersonID" = t2."PersonID" AND t1."Sequence"::integer < t2."Sequence"::integer
//     where t2."PersonID" IS NULL
//     order by t1."PersonID" asc;
//   `
// );

const t1 = alias(vwPersonCPALicenses, 't1');
const t2 = alias(vwPersonCPALicenses, 't2');
const { ...t1Cols } = getTableColumns(t1);
const lastSequencePersonCPALicenses = db.select(t1Cols)
  .from(t1)
  .leftJoin(t2, and(eq(t1.PersonID, t2.PersonID), lt(sql`${t1.Sequence}::integer`, sql`${t2.Sequence}::integer`)))
  .where(isNull(t2.PersonID))
  .orderBy(asc(t1.PersonID))
  .as('t1');

export const cpaLicensePersons = pgMaterializedView('cpa_license_persons')
  .using('columnar')
  .as(
    db.select({
      // ...cols,
      personId: lastSequencePersonCPALicenses.PersonID,
      licenseStatus: lastSequencePersonCPALicenses.LicenseStatus,
      micpaLaraLicenseStatus: lastSequencePersonCPALicenses.MICPA_LARAStatus,
      expirationDate: lastSequencePersonCPALicenses.ExpirationDate,

      region: vwPersons.MACPA_Region,
      company: vwPersons.CompanyName,
      firstLast: vwPersons.FirstLast,
      firstName: vwPersons.FirstName,
      lastName: vwPersons.LastName,
      title: vwPersons.Title,
      memberType: vwPersons.MemberType,
      memberStatus: vwPersons.StatusName,
      joinDate: vwPersons.JoinDate,
      duesPaidThru: vwPersons.DuesPaidThru,
      city: vwPersons.City,
      state: vwPersons.State,
      email: vwPersons.Email,
    })
    .from(lastSequencePersonCPALicenses)
    .leftJoin(vwPersons, eq(vwPersons.ID, lastSequencePersonCPALicenses.PersonID))
    .where(and(
      eq(lastSequencePersonCPALicenses.LicenseType, 'Certified Public Accountant'),
    ))
  );

// }}}

// {{{ Base tables


// debug
//const pgDialect = new PgDialect();
//console.log('personsWhoWereShipped', pgDialect.sqlToQuery(getMaterializedViewConfig(personsWhoWereShipped).query).sql);

/// }}}

