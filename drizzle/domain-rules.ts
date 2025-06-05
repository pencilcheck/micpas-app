import { and, eq, getTableColumns, gte, inArray, sql } from "drizzle-orm"
import { PgColumn } from "drizzle-orm/pg-core"
import { db } from '../orm/local'

import { fiscalYear, minEducationFiscalYearString, minFiscalYearString, orderStatusShipped, orderTypeCancel, orderTypeQuotation, orderTypeRegular } from '../db/helper'
import { vwEducationUnits, vwOrderDetails, vwOrders } from "./schema"

export type OrderDetails = typeof vwOrderDetails;
// export type Products = typeof vwProducts;
export type EducationUnit = typeof vwEducationUnits;
export type Orders = typeof vwOrders;

export const removeNewLineCarriageReturn = (column: PgColumn) => {
  return sql`TRIM(REGEXP_REPLACE(${column}, E'[\\n\\r\\f\\u000B\\u0085\\u2028\\u2029]+', ' ', 'gi'))`
}

export const computeEntityName = (campaignCodeName: PgColumn) => {
  return sql`TRIM(REGEXP_REPLACE(${removeNewLineCarriageReturn(campaignCodeName)}, ' Pre-Paid Dues.*$| NEW STAFF.*$', '', 'gi'))`
}

// To debug
//const pgDialect = new PgDialect();
//console.log(pgDialect.sqlToQuery(getMaterializedViewConfig(yearlyCombinationQuotesByMemberTypeCount).query).sql)

// export const shipmentAlias = alias(vwOrders, "parent")
// export const noCancelCondition = (matchId: PgColumn, matchLineId: PgColumn) =>
//   notExists(
//     db.select({ id: shipmentAlias.id })
//     .from(shipmentAlias)
//     .where(and(
//       eq(shipmentAlias.originalOrderDetailId, matchLineId),
//       eq(shipmentAlias.originalOrderId, matchId),
//       eq(sql`trim(${shipmentAlias.orderTypeId})`, orderTypeCancel)
//     ))
//   )

// Since a lot of combined types from Ryan look into campaign code, we can't rely on campaign code here for individuals anymore, has to be coded in our computed product id above
// similar to the membertype ids, because now we limited automatically to the computed id we specify
export const shipmentCommonConditions = (dataTable: Orders) =>
  and(
    // isNotNull(dataTable.ShipDate), // make sure it is a closed order
    eq(sql`trim(${dataTable.OrderTypeID})`, orderTypeRegular),
    eq(sql`trim(${dataTable.OrderStatusID})`, orderStatusShipped)
    // noCancelCondition(dataTable.orderId, dataTable.id) // no corresponding cancel orders
  )

export const orderCommonConditions = (dataTable: Orders) =>
  and(
    inArray(sql`trim(${dataTable.OrderTypeID})`, [orderTypeQuotation, orderTypeRegular, orderTypeCancel]),
    // noCancelCondition(dataTable.orderId, dataTable.id) // no corresponding cancel orders
  )

export const minimumDateRangeConditions = (dataTable: Orders) =>
  and(
    gte(sql`DATE_PART('YEAR', ${dataTable.OrderDate}::timestamp)`, minFiscalYearString), // make sure it is a closed order
  )

export const minimumDateEarnedRangeConditions = (dataTable: EducationUnit) =>
  and(
    gte(sql`DATE_PART('YEAR', ${dataTable.DateEarned}::timestamp)`, minEducationFiscalYearString), // make sure it is a closed order
  )

export const extendedAttributesOrder = (dataTable: Orders) => {
  const { ...originalCols } = getTableColumns(dataTable);

  return db.select({
    ...originalCols,
    ...extendedAttributes(dataTable),
  })
  .from(dataTable)
  .$dynamic();
}

export const extendedAttributes = (dataTable: Orders) => {
  return {
    // orderMonth: sql`EXTRACT(MONTH FROM ${dataTable.OrderDate}::timestamp)`.as('orderMonth'),
    // orderDay: sql`EXTRACT(DAY FROM ${dataTable.OrderDate}::timestamp)`.as('orderDay'),
    // fiscalDate: fiscalYear(dataTable.OrderDate).as("fiscalDate"),
    // segment: computeSegment(
    //   dataTable.campaignCodeName,
    //   db.select({ type: vwCampaigns.type }).from(vwCampaigns).where(eq(vwCampaigns.id, dataTable.campaignCodeId)).$dynamic()
    // ).as('segment'),
    // computedLine1ProductId: computeLine1ProductId(dataTable.campaignCodeName, dataTable.line1ProductId).as('computedLine1ProductId'),
    // computedLine1ProductName: computeLine1ProductName(dataTable.campaignCodeName, dataTable.line1ProductId).as('computedLine1ProductName'),
    // computedEntityName: computeEntityName(dataTable.campaignCodeName).as('computedEntityName'), // for entity tabs
    // billToCompany: sql`TRIM(${removeNewLineCarriageReturn(dataTable.billToCompany)})`.as('BillToCompany') // retain original naming from DB
  };
}
