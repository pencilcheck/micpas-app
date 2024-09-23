export { db }

import 'dotenv/config';

import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
const { Pool } = pg;

const client = new Pool({
  connectionString: process.env.DRIZZLE_DATABASE_URL!,
  //ssl: {
    //rejectUnauthorized: false
  //}
});
 
const db = drizzle(client);
