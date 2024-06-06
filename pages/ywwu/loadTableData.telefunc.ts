import { and, eq, getTableColumns, gte, ilike, inArray, lte, sql } from 'drizzle-orm';
import compact from 'lodash/compact';
import { educationVectors, personsToReachOut } from '../../drizzle/ywwu';
import { db } from '../../orm/local';
import { getMaterializedViewConfig } from 'drizzle-orm/pg-core';
import dayjs, { Dayjs } from 'dayjs';
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

export async function load({ dates, keywords }: { dates?: string[], keywords?: string[] }) {
  const days = (dates || []).map((d, i) => i === 0 ? dayjs(d).startOf('month') : dayjs(d).endOf('month'));
  // filter by education units text search (keywords) and dates
  // filter by meeting ids (within UI)
  // filter by deceased (already excluded in view)
  // filter by other values (within UI)

  // make sure there is no duplicate person ids
  console.log('days', days.map(d => d.toISOString()))
  console.log('keywords', compact(keywords))

  const tsQuery = compact(keywords)?.length > 0 ? compact(keywords).map((k: string) => `'${k}'`).join(' | ') : false;

  const query = await db.selectDistinct({
    id: educationVectors.id
  })
  .from(educationVectors)
  .where(and(
    tsQuery ? sql`${educationVectors.vector} @@ to_tsquery(${tsQuery})` : undefined,
    days?.length > 0 ? and(
      gte(sql`${educationVectors.macpa_creditdate}::timestamp`, sql`${days[0].toISOString()}::timestamp`),
      lte(sql`${educationVectors.macpa_creditdate}::timestamp`, sql`${days[1].toISOString()}::timestamp`),
    ) : undefined
  ));

  console.log('query', query.length);

  const result = await db.selectDistinctOn([personsToReachOut.id])
  .from(personsToReachOut)
  .where(
    query && query.length > 0 && (dates || keywords)
    ? inArray(personsToReachOut.id, query.filter(q => q.id).map(q => q.id!))
    : undefined
  )
  .limit(90000)
  ;

  console.log('result', result.length);

  const cols = getMaterializedViewConfig(personsToReachOut).selectedFields;

  // no pagination, load all data into UI
  return {
    rowData: result,
    colDefs: Object.keys(cols).map((key) => ({
      field: key,
      filter: 'agMultiColumnFilter',
      filterParams: {
        filters: [
          {
            filter: 'agTextColumnFilter',
            filterParams: {
              filterOptions: [
                "contains",
                "notContains",
                "notBlank", // dan requested this
              ],
              debounceMs: 200,
              maxNumConditions: 10,
            }
          },
          {
            filter: 'agSetColumnFilter',
          }
        ],
      }
    }))
  }
}
