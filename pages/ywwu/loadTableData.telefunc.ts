import { and, eq, getTableColumns, gte, inArray, lte, sql } from 'drizzle-orm';
import { personsToReachOut } from '../../drizzle/ywwu';
import { db } from '../../orm/local';
import { getMaterializedViewConfig } from 'drizzle-orm/pg-core';
import { Dayjs } from 'dayjs';
import { vwEducationUnits } from '../../drizzle/schema';

export async function loadPrimaryFunctions() {
//APTIFY..vwPersons.PrimaryFunction = N'Firm Administrator' 
  return [];
}

export async function licenseStates() {
//vwPersonCPALicenses.LicenseState
  return [];
}

export async function loadHomeStates() {
//APTIFY..vwPersons.HomeState
  return [];
}

export async function loadRegions() {
//APTIFY..vwPersons.MACPA_Region
  return [];
}

export async function load({ dates, keywords }: { dates: string[], keywords: string[] }) {
  // filter by education units text search (keywords) and dates
  // filter by meeting ids (within UI)
  // filter by deceased (already excluded in view)
  // filter by other values (within UI)

  // make sure there is no duplicate person ids

  const query = db.selectDistinct({
    id: vwEducationUnits.personid
  })
  .from(vwEducationUnits)
  .where(and(
    keywords?.length > 0 ? inArray(vwEducationUnits.externalsource, keywords) : undefined,
    dates?.length > 0 ? and(
      gte(sql`${vwEducationUnits.macpa_creditdate}::timestamp`, sql`${dates[0]}::timestamp`),
      lte(sql`${vwEducationUnits.macpa_creditdate}`, sql`${dates[1]}::timestamp`),
    ) : undefined
  ));

  const hasCondition = keywords?.length > 0 || dates?.length > 0;

  const educationCondition = sql`${query}`;

  const result = await db.select()
  .from(personsToReachOut)
  .where(hasCondition ? inArray(personsToReachOut.id, educationCondition) : undefined)
  ;

  const cols = getMaterializedViewConfig(personsToReachOut).selectedFields;

  // no pagination, load all data into UI
  return {
    rowData: result,
    colDefs: Object.keys(cols).map((key) => ({
      field: key,
      filter: true,
      filterParams: {
        filterOptions: [
          "contains",
          "notContains",
        ],
        debounceMs: 200,
        maxNumConditions: 10,
      }
    }))
  }
}
