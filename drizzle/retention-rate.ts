// TODO: https://orm.drizzle.team/kit-docs/upgrade-21#how-to-migrate-to-0210
import { and, eq, getTableColumns, gte, isNull, lt, not, sql } from "drizzle-orm";
import { alias, getMaterializedViewConfig, numeric, pgMaterializedView, pgView, text, timestamp } from "drizzle-orm/pg-core";
import { db } from '../orm/local';

import { fiscalYearHalf, minFiscalYearString } from '../db/helper';
import { Orders, extendedAttributesOrder, minimumDateRangeConditions, orderCommonConditions, shipmentCommonConditions } from "./domain-rules";
import { vwOrders } from "./schema";

// --------- vwOrders: Shipments (orders with shipment) with order line backed up every 2 weeks or 1 month ---------- //
const { ...shipmentCols } = getTableColumns(vwOrders);

// {{{ Extended raw tables

export const extendedVwOrders = pgMaterializedView('extended_vwOrders')
  .using('columnar')
  .as(
    extendedAttributesOrder(vwOrders)
    .where(and(
      orderCommonConditions(vwOrders),
      minimumDateRangeConditions(vwOrders),
    ))
  );

// }}}

// {{{ Base tables
const extendedVwOrdersViewColumns = getMaterializedViewConfig(extendedVwOrders).selectedFields as any;
const orderAlias = alias(extendedVwOrders, "parent")
const psr = 
  db.select({
    ...extendedVwOrdersViewColumns,
    prevFiscalYearOrderId: sql`${orderAlias.ID}`.as('prevFiscalYearOrderId'), // if this field isn't null then it is retained from previous year, otherwise it is a new recruitment
  })
  .from(extendedVwOrders)
  .leftJoin(orderAlias, and(
    eq(orderAlias.ShipToID, extendedVwOrders.ShipToID),
    eq(sql`${fiscalYearHalf(orderAlias.OrderDate)}+1`, fiscalYearHalf(extendedVwOrders.OrderDate)),
  ))
  .where(and(
    shipmentCommonConditions(extendedVwOrders as unknown as Orders),
  ))
  .as("psr")

export const shippedVwOrders = pgMaterializedView('shipped_vworders')
  .using('columnar')
  .as(
    db.select()
    .from(psr)
  )


// debug
//const pgDialect = new PgDialect();
//console.log('personsWhoWereShipped', pgDialect.sqlToQuery(getMaterializedViewConfig(personsWhoWereShipped).query).sql);

/// }}}

// {{{ Alternative calculation base tables

// {{{ Time series table
// --------- below is basically the tables above but store all possible combination of order month-year start-end configurations (within fiscal year)

const listOfDuesProducts = db.selectDistinct({ id: sql`${vwOrders.Line1_ProductID}`.as('member_type_id') }).from(vwOrders).where(eq(sql`TRIM(${vwOrders.Line1_ProductCategory})`, 'Dues'))

// NOTE: MICPA seems to want to use March instead of April

export const timeSeriesTable = pgMaterializedView('time_series_table', {
  yearValue: numeric('year_value'),
  orderStartMonthYear: timestamp('start_month_year'),
  orderEndMonthYear: timestamp('end_month_year'),
  memberTypeId: text('member_type_id'),
})
.using('columnar')
.as(
  sql`
  select * from (
    select * from (
        select * from generate_series(
          ((EXTRACT(YEAR FROM CURRENT_DATE))-4),
          (EXTRACT(YEAR FROM CURRENT_DATE)),
          1
        ) year_value
    ) iter_year
    cross join lateral
        generate_series(
          (iter_year.year_value || '-03-01 00:00:00')::timestamp,
          ((iter_year.year_value+1) || '-02-01 00:00:00')::timestamp,
          INTERVAL '1 month'
        ) as t(start_month_year)
        cross join
            generate_series(
              start_month_year + INTERVAL '1 month',
              ((iter_year.year_value+1) || '-03-01 00:00:00')::timestamp,
              INTERVAL '1 month'
            ) as y(end_month_year)
  ) time_series
  cross join (${listOfDuesProducts}) member_type_id;
  `
);
// }}}

// {{{ Alternative calculation base views
const memberBasePersonsQuotedLateralTable = 
    db.select({
      id: shippedVwOrders.ID,
      shipToId: shippedVwOrders.ShipToID
    })
    .from(shippedVwOrders)
    .where(and(
      eq(shippedVwOrders.Line1_ProductID, timeSeriesTable.memberTypeId),
      gte(sql`${shippedVwOrders.OrderDate}::timestamp`, sql`${timeSeriesTable.orderStartMonthYear}::timestamp - INTERVAL '1 year'`),
      lt(sql`${shippedVwOrders.OrderDate}::timestamp`, sql`${timeSeriesTable.orderStartMonthYear}::timestamp`),
    ))
export const memberBaseYearlyCombinationPersonsQuotedByMemberTypeCount = pgView('member_base_yearly_combination_persons_quoted_by_membertype_count', {
  orderYear: numeric('year_value'),
  orderStartMonthYear: timestamp('start_month_year'),
  orderEndMonthYear: timestamp('end_month_year'),
  memberTypeId: text('member_type_id'),
  orderId: text('ID'),
  shipToId: text('ShipToID'),
}).as(
  sql`
  select *
  from ${timeSeriesTable}
  cross join lateral
  ${memberBasePersonsQuotedLateralTable}
  order_count
  `
);

const memberBasePersonsConvertedLateralTable = 
    db.select({
      orderId: shippedVwOrders.ID,
      shipToId: shippedVwOrders.ShipToID,
      extended: sql`COALESCE(${shippedVwOrders.GrandTotal}::float, 0)::float`.as('Extended'),
    })
    .from(shippedVwOrders)
    .where(and(
      eq(shippedVwOrders.Line1_ProductID, timeSeriesTable.memberTypeId),
      gte(sql`${shippedVwOrders.OrderDate}::timestamp`, sql`${timeSeriesTable.orderStartMonthYear}::timestamp`),
      lt(sql`${shippedVwOrders.OrderDate}::timestamp`, sql`${timeSeriesTable.orderEndMonthYear}::timestamp`),

      not(isNull(shippedVwOrders.prevFiscalYearOrderId)),
    ))
export const memberBaseYearlyCombinationPersonsConvertedByMemberTypeCount = pgView('member_base_yearly_combination_persons_converted_by_membertype_count', {
  orderYear: numeric('year_value'),
  orderStartMonthYear: timestamp('start_month_year'),
  orderEndMonthYear: timestamp('end_month_year'),
  memberTypeId: text('member_type_id'),
  extended: text('Extended'),
  orderId: text('ID'),
  shipToId: text('ShipToID'),
}).as(
  sql`
  select *
  from ${timeSeriesTable}
  cross join lateral
  ${memberBasePersonsConvertedLateralTable}
  order_count
  `
);

// }}}

// {{{ New Alternative Calculation Materialized Views

export const combinationPersonsQuotedByMemberTypeCount = pgMaterializedView('combination_persons_quoted_by_membertype_count')
.using('columnar')
.as(
  db.select({
    orderYear: memberBaseYearlyCombinationPersonsQuotedByMemberTypeCount.orderYear,
    orderStartMonthYear: memberBaseYearlyCombinationPersonsQuotedByMemberTypeCount.orderStartMonthYear,
    orderEndMonthYear: memberBaseYearlyCombinationPersonsQuotedByMemberTypeCount.orderEndMonthYear,
    memberTypeId: memberBaseYearlyCombinationPersonsQuotedByMemberTypeCount.memberTypeId,
    orderCount: sql<number>`count(distinct ${memberBaseYearlyCombinationPersonsQuotedByMemberTypeCount.shipToId})::integer`.as('orderCount')
  })
  .from(memberBaseYearlyCombinationPersonsQuotedByMemberTypeCount)
  .where(and(
    gte(memberBaseYearlyCombinationPersonsQuotedByMemberTypeCount.orderYear, minFiscalYearString),
  ))
  .groupBy(
    memberBaseYearlyCombinationPersonsQuotedByMemberTypeCount.orderYear,
    memberBaseYearlyCombinationPersonsQuotedByMemberTypeCount.orderStartMonthYear,
    memberBaseYearlyCombinationPersonsQuotedByMemberTypeCount.orderEndMonthYear,
    memberBaseYearlyCombinationPersonsQuotedByMemberTypeCount.memberTypeId,
  )
  .orderBy(
    memberBaseYearlyCombinationPersonsQuotedByMemberTypeCount.orderYear,
    memberBaseYearlyCombinationPersonsQuotedByMemberTypeCount.orderStartMonthYear,
    memberBaseYearlyCombinationPersonsQuotedByMemberTypeCount.memberTypeId,
  )
);

export const combinationPersonsConvertedByMemberTypeCount = pgMaterializedView('combination_persons_converted_by_membertype_count')
.using('columnar')
.as(
  db.select({
    orderYear: memberBaseYearlyCombinationPersonsConvertedByMemberTypeCount.orderYear,
    orderStartMonthYear: memberBaseYearlyCombinationPersonsConvertedByMemberTypeCount.orderStartMonthYear,
    orderEndMonthYear: memberBaseYearlyCombinationPersonsConvertedByMemberTypeCount.orderEndMonthYear,
    memberTypeId: memberBaseYearlyCombinationPersonsConvertedByMemberTypeCount.memberTypeId,
    extendedTotal: sql<number>`sum(${memberBaseYearlyCombinationPersonsConvertedByMemberTypeCount.extended}::float)`.as('extendedTotal'),
    shipCount: sql<number>`count(distinct ${memberBaseYearlyCombinationPersonsConvertedByMemberTypeCount.shipToId})::integer`.as('shipCount')
  })
  .from(memberBaseYearlyCombinationPersonsConvertedByMemberTypeCount)
  .where(and(
    gte(memberBaseYearlyCombinationPersonsConvertedByMemberTypeCount.orderYear, minFiscalYearString),
  ))
  .groupBy(
    memberBaseYearlyCombinationPersonsConvertedByMemberTypeCount.orderYear,
    memberBaseYearlyCombinationPersonsConvertedByMemberTypeCount.orderStartMonthYear,
    memberBaseYearlyCombinationPersonsConvertedByMemberTypeCount.orderEndMonthYear,
    memberBaseYearlyCombinationPersonsConvertedByMemberTypeCount.memberTypeId,
  )
  .orderBy(
    memberBaseYearlyCombinationPersonsConvertedByMemberTypeCount.orderYear,
    memberBaseYearlyCombinationPersonsConvertedByMemberTypeCount.orderStartMonthYear,
    memberBaseYearlyCombinationPersonsConvertedByMemberTypeCount.memberTypeId,
  )
);

// }}}

// {{{ Drilldown
export const memberBasePersonsQuotedByMemberTypeDetails = pgMaterializedView('member_base_persons_quoted_by_membertype_details')
.using('columnar')
.as(
  db.select()
  .from(memberBaseYearlyCombinationPersonsQuotedByMemberTypeCount)
);


// ---------------- materialized views of the pgViews current quotes ------------------- //

// ---------------- drilldown view for gen pop ------------------- //
export const memberBasePersonsConvertedByMemberTypeDetails = pgMaterializedView('member_base_persons_converted_by_membertype_details')
.using('columnar')
.as(
  db.select()
  .from(memberBaseYearlyCombinationPersonsConvertedByMemberTypeCount)
);

// }}}
