import { defineConfig } from "drizzle-kit"
import 'dotenv/config';
 
export default defineConfig({
  dialect: 'postgresql',
  schema: ["./drizzle/schema.ts"],
  out: "./drizzle",
  schemaFilter: ["public"],
  verbose: true,
  dbCredentials: {
    url: process.env.DRIZZLE_DATABASE_URL!,
  },
  migrations: {
    table: "migrations",
    schema: "drizzle"
  }
});
