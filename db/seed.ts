import { parse, parser } from 'csv';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';
import { sql } from 'drizzle-orm';
import fs from 'fs';
import indexOf from 'lodash/indexOf';
import reduce from 'lodash/reduce';
import path from 'path';
import { db } from '../orm/local';
import { __dirname } from './helper/path';
dayjs.extend(utc)
dayjs.extend(customParseFormat)

async function deleteAll(tableName: unknown) {
  await db.execute(sql`TRUNCATE TABLE ${tableName} RESTART IDENTITY;`);
}

function trycatch(func: () => string, fail: string): string {
  try { return func() }
  catch(e) { console.log(fail); throw e; }
}

// Turning stream into a promise that return an array of object parsed by parser
function streamAsPromise(stream: parser.Parser): Promise<string[][]> {
  return new Promise((resolve, reject) => {
    const data: string[][] = [];
    stream.on("data", (row: string[]) => data.push(row));
    stream.on("end", () => resolve(data));
    stream.on("error", error => reject(error));
  });
}

function readStreamForColumn(filename: string) {
  return fs.createReadStream(path.join(__dirname, filename))
  .pipe(parse({ delimiter: ",", from_line: 1, to_line: 1 }));
}

function readStreamForData(filename: string) {
  return fs.createReadStream(path.join(__dirname, filename))
  .pipe(parse({
    delimiter: ",",
    from_line: 2,
    cast: (value) => {
      if (value === '') {
        return null;
      } else {
        return value;
      } 
    }
  }))
}

function transformIntoValues(chunks, columns) {
  const values = chunks.map((row) => {
    return reduce(columns, (init, col) => {
      if (col === 'billToCompany') {
        return {
          ...init,
          [col]: row[indexOf(columns, col)] as string,
        }
      }
      if (col === 'orderDate') {
        return {
          ...init,
          [col]: dayjs(row[indexOf(columns, col)]).format('YYYY-MM-DD 00:00:00') as string,
        }
      }
      if (col === 'line1ProductName') {
        return {
          ...init,
          [col]: row[indexOf(columns, col)] as string,
          ['line1ProductId']: matchProductNameToId(row[indexOf(columns, col)]),
        }
      }
      return {
        ...init,
        [col]: row[indexOf(columns, col)] as string,
      }
    }, { "orderType": "Quotation" })
  })

  return values;
}

async function main() {
}
main()
  .then(async () => {
    console.log('finish seeding')
  })
  .catch(async (e) => {
    console.error(e)
    process.exit(1)
  })
