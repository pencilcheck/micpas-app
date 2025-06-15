// TODO: https://orm.drizzle.team/kit-docs/upgrade-21#how-to-migrate-to-0210
import { and, eq, getTableColumns, gte, isNull, lt, not, sql } from "drizzle-orm";
import { alias, getMaterializedViewConfig, numeric, pgMaterializedView, pgView, text, timestamp } from "drizzle-orm/pg-core";
import { db } from '../orm/local';

import { fiscalYearHalf, minFiscalYearString } from '../db/helper';
import { Orders, extendedAttributesOrder, minimumDateRangeConditions, orderCommonConditions, shipmentCommonConditions } from "./domain-rules";
import { vwEducationUnits, vwOrders, vwPersonCPALicenses, vwPersons, vwPersonsPartitions } from "./schema";

// --------- vwOrders: Shipments (orders with shipment) with order line backed up every 2 weeks or 1 month ---------- //
const { ...shipmentCols } = getTableColumns(vwOrders);

// {{{ Extended raw tables

// NOTE: for MI only for now
const recentDatePerPerson = db.select({
    personId: vwEducationUnits.PersonID,
    dateEarned: vwEducationUnits.DateEarned,
    rowNum: sql`ROW_NUMBER() OVER (PARTITION BY ${vwEducationUnits.PersonID} ORDER BY ${vwEducationUnits.DateEarned}::timestamp DESC)`.as('recentDatePerPerson_rowNum')
  })
    .from(vwEducationUnits)
    .where(and(eq(vwEducationUnits.EducationCategoryID, '10'))) // MI
    .as('recentDatePerPerson');

export const cpaLicenseEducationPerCategory = pgMaterializedView('cpa_license_education_per_category')
  .using('columnar')
  .as(
    db.select({
      personID: vwPersonCPALicenses.PersonID,
      licenseType: vwPersonCPALicenses.LicenseType,
      licenseNo: vwPersonCPALicenses.LicenseNo,
      expirationDate: vwPersonCPALicenses.ExpirationDate,

      firstName: vwPersons.FirstName,
      lastName: vwPersons.LastName,
      city: vwPersons.City,
      state: vwPersons.State,
      email: vwPersons.Email,
      memberType: vwPersons.MemberType,
      company: vwPersons.Company,
      companyId: vwPersons.CompanyID,

      recentDateEarned: recentDatePerPerson.dateEarned,

      educationCategory: vwEducationUnits.EducationCategory,
      educationCategoryID: vwEducationUnits.EducationCategoryID,

      educationUnits: sql`sum(${vwEducationUnits.EducationUnits}::float) filter(where ${vwEducationUnits.DateEarned}::timestamp >= (${vwPersonCPALicenses.ExpirationDate}::timestamp - interval '2 years'))`.as('educationUnits'),
    })
    .from(vwPersonCPALicenses)
    .leftJoin(vwPersons, eq(vwPersons.ID, vwPersonCPALicenses.PersonID))
    .leftJoin(recentDatePerPerson, and(eq(recentDatePerPerson.personId, vwPersonCPALicenses.PersonID), eq(recentDatePerPerson.rowNum, 1)))
    .leftJoin(vwEducationUnits, eq(vwEducationUnits.PersonID, vwPersonCPALicenses.PersonID))
    .where(and(
      eq(vwPersonCPALicenses.MICPA_LARAStatus, 'Active'),
      eq(vwPersonCPALicenses.LicenseType, 'Certified Public Accountant'),
    ))
    .groupBy(
      vwPersonCPALicenses.PersonID,
      vwPersonCPALicenses.LicenseType,
      vwPersonCPALicenses.LicenseNo,
      vwPersonCPALicenses.ExpirationDate,

      vwPersons.FirstName,
      vwPersons.LastName,
      vwPersons.City,
      vwPersons.State,
      vwPersons.Email,
      vwPersons.MemberType,
      vwPersons.Company,
      vwPersons.CompanyID,

      recentDatePerPerson.dateEarned,

      vwEducationUnits.EducationCategory,
      vwEducationUnits.EducationCategoryID,
    )
  );

// }}}

// {{{ Base tables


// debug
//const pgDialect = new PgDialect();
//console.log('personsWhoWereShipped', pgDialect.sqlToQuery(getMaterializedViewConfig(personsWhoWereShipped).query).sql);

/// }}}

