import Promise from 'bluebird';
import { sql } from "drizzle-orm";
import { getMaterializedViewConfig, getViewConfig } from "drizzle-orm/pg-core";
import { db } from '../orm/local';
import { personsToReachOut } from '../drizzle/ywwu';


const foundation = () => {

  return [
    personsToReachOut
  ]
}

// don't generate data (in general) on migration to avoid timeout from neon
const migrateViews = async () => {
  // debugging
  //const pgDialect = new PgDialect();
  //console.log(pgDialect.sqlToQuery(getMaterializedViewConfig(personsWhoWereQuoted).query).sql)

  const list = [
    {
      name: 'foundation',
      views: foundation(),
    },
    //{
      //name: 'yearlyRetentionFoundation',
      //views: yearlyRetentionFoundation(),
      //viewOnly: true,
    //},
  ]

  if (process.argv.includes('--drop-only')) {
    console.log('dropViews')

    for (const { name, views, viewOnly } of list) {
      console.log('dropViews', name);
      await Promise.each(views, async (view) => {
        if (viewOnly) {
          console.log('dropViews name', getViewConfig(view).name);
          await db.execute(sql`drop view if exists ${view} cascade;`)
        } else {
          console.log('dropViews name', getMaterializedViewConfig(view).name);
          await db.execute(sql`drop materialized view if exists ${view} cascade;`)
        }
        return;
      });
    }
  }

  if (process.argv.includes('--migrate-only')) {
    console.log('migrateViews')

    for (const { name, views, viewOnly } of list) {
      console.log('migrateViews', name);
      await Promise.each(views, async (view) => {
        if (viewOnly) {
          console.log('migrateViews name', getViewConfig(view).name);
          await db.execute(sql`create or replace view ${view} as ${getViewConfig(view).query};`)
        } else {
          console.log('migrateViews name', getMaterializedViewConfig(view).name);
          await db.execute(sql`drop materialized view if exists ${view} cascade;`)
          await db.execute(sql`create materialized view ${view} as ${getMaterializedViewConfig(view).query} with no data;`)
        }
        return;
      });
    }
  }

  if (process.argv.includes('--refresh-only')) {
    console.log('refreshViews')

    // something is weird with hydra not able to allow parallel execution of refresh view
    await db.execute(sql`set max_parallel_workers_per_gather = 0;`);

    for (const { name, views, viewOnly } of list) {
      console.log('refreshViews', name);
      await Promise.each(views, async (view) => {
        if (!viewOnly) {
          console.log('refreshViews name', getMaterializedViewConfig(view).name);
          return await db.refreshMaterializedView(view);
        }
        return;
      });
    }
  }
}

(async () => {
  await migrateViews();
})().catch(console.log)
