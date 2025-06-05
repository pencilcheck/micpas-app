import { sql, type SQL } from "drizzle-orm"
import { PgColumn } from "drizzle-orm/pg-core"

export const orderTypeQuotation = '4'
export const orderTypeRegular = '1'
export const orderTypeCancel = '3'
export const orderStatusShipped = '2'
export const orderStatusCancelled = '4'

const cpeYearOffset = ((new Date().getFullYear()-2015) % 3)
export const currentCpeYear = (new Date().getMonth()) < 9 ? (new Date().getFullYear() - cpeYearOffset - 3) : (new Date().getFullYear() - cpeYearOffset)

export const minEducationFiscalYearString = ((new Date().getMonth()) < 9
  ? (new Date().getFullYear()-6)
  : (new Date().getFullYear()-5)).toString();

// right now we only need current fiscal year and previous fiscal year, might change in the future
export const minFiscalYearString = ((new Date().getMonth()) < 3
  ? (new Date().getFullYear()-6)
  : (new Date().getFullYear()-5)).toString();

export const minDiscountYearString = '2018';

export const previousFiscalYearString = (new Date().getMonth()) >= 3
  ? (`${(new Date().getFullYear()-1).toString()}-${(new Date().getFullYear()).toString()}`)
  : (`${(new Date().getFullYear()-2).toString()}-${(new Date().getFullYear()-1).toString()}`);

export const fiscalYearString = (new Date().getMonth()) >= 3
  ? (`${new Date().getFullYear().toString()}-${(new Date().getFullYear()+1).toString()}`)
  : (`${(new Date().getFullYear()-1).toString()}-${new Date().getFullYear().toString()}`);

export const nextFiscalYearString = (new Date().getMonth()) >= 3
  ? (`${(new Date().getFullYear()+1).toString()}-${(new Date().getFullYear()+2).toString()}`)
  : (`${new Date().getFullYear().toString()}-${(new Date().getFullYear()+1).toString()}`);

export const fiscalYearHalf = (dateField: PgColumn | SQL<unknown>) => sql<number>`
CASE
    WHEN DATE_PART('MONTH', ${dateField}::timestamp) >= 4
    THEN DATE_PART('YEAR', ${dateField}::timestamp)
    ELSE DATE_PART('YEAR', ${dateField}::timestamp)-1
END
`

export const fiscalYear = (dateField: PgColumn | SQL<unknown>) => sql<string>`
CASE
    WHEN DATE_PART('MONTH', ${dateField}::timestamp) >= 4
    THEN concat(DATE_PART('YEAR', ${dateField}::timestamp), '-', DATE_PART('YEAR', ${dateField}::timestamp)+1)
    ELSE concat(DATE_PART('YEAR', ${dateField}::timestamp)-1, '-', DATE_PART('YEAR', ${dateField}::timestamp))
END
`

export const nextFiscalYear = (dateField: PgColumn) => sql<string>`
CASE
    WHEN DATE_PART('MONTH', ${dateField}::timestamp) >= 4
    THEN concat(DATE_PART('YEAR', ${dateField}::timestamp)+1, '-', DATE_PART('YEAR', ${dateField}::timestamp)+2)
    ELSE concat(DATE_PART('YEAR', ${dateField}::timestamp), '-', DATE_PART('YEAR', ${dateField}::timestamp)+1)
END
`

export const nextFiscalOrderDate = (dateField: PgColumn) => sql<string>`
CASE
    WHEN DATE_PART('MONTH', ${dateField}::timestamp) >= 4
    THEN DATE_TRUNC('YEAR', ${dateField}::timestamp) + interval '1 year 3 months'
    ELSE DATE_TRUNC('YEAR', ${dateField}::timestamp) + interval '3 months'
END
`

export const nextFiscalOrderDateValue = (dateField: SQL<string>) => sql<string>`
CASE
    WHEN DATE_PART('MONTH', ${dateField}::timestamp) >= 4
    THEN DATE_TRUNC('YEAR', ${dateField}::timestamp) + interval '1 year 3 months'
    ELSE DATE_TRUNC('YEAR', ${dateField}::timestamp) + interval '3 months'
END
`
