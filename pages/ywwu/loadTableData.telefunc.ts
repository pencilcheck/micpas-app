import dayjs from 'dayjs';
import { and, eq, gte, inArray, lte, sql } from 'drizzle-orm';
import { getMaterializedViewConfig } from 'drizzle-orm/pg-core';
import compact from 'lodash/compact';
import { educationVectors, personsToReachOut } from '../../drizzle/ywwu';
import { db } from '../../orm/local';

const colHeader: {[key: string]: string} = {
  "id": "ID",
  "firstName": "First Name",
  "lastName": "Last Name",
  "preferredAddress": "Preferred Address",
  "company": "Company",
  "macpa_preferredAddressLine1": "Preferred Address Line 1",
  "macpa_preferredAddressLine2": "Preferred Address Line 2",
  "macpa_preferredAddressLine3": "Preferred Address Line 3",
  "macpa_preferredAddressLine4": "Preferred Address Line 4",
  "macpa_preferredCity": "Preferred City",
  "macpa_preferredState": "Preferred State",
  "macpa_preferredZip": "Preferred Zip",
  "macpa_badgeName": "Badge Name",
  "memberType": "Member Type",
  "email": "Email",
}

export async function load({ source, dates, keywords }: { source?: 'Both' | '3rd Party' | 'No 3rd Party'; dates?: string[], keywords?: string[] }) {
  const days = (dates || []).map((d, i) => i === 0 ? dayjs(d).startOf('month') : dayjs(d).endOf('month'));
  // make sure there is no duplicate person ids
  console.log('days', days.map(d => d.toISOString()))
  console.log('keywords', compact(keywords))

  const tsQuery = compact(keywords)?.length > 0 ? compact(keywords).map((k: string) => `'${k}'`).join(' | ') : false;

  const query = await db.selectDistinct({
    id: educationVectors.id
  })
  .from(educationVectors)
  .where(and(
    source === 'Both' || !source
      ? undefined
      : (source === '3rd Party' ? eq(educationVectors.isThirdParty, true) : eq(educationVectors.isThirdParty, false)),
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
    // the colDefs will be expanded in frontend as functions can't be serialized across network using telefunc
    colDefs: Object.keys(cols).map((key) => ({
      headerName: colHeader[key],
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
