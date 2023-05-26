// The below can be used in a Jest global setup file or similar for your testing set-up
import { loadEnvConfig } from "@next/env";

(async () => {
  const projectDir = process.cwd();
  loadEnvConfig(projectDir);
})();
import { Pool } from "pg";

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.TEST_DATABASE,
  password: process.env.PGPASSWORD,
  port: parseInt(process.env.PGPORT ?? "5432"),
});

export default async function makeDb() {
  return await pool.connect();
}

export async function closeDb() {
  await pool.end();
}

export async function clearDb(tableName: string) {
  return (await pool.query(`DELETE FROM ${tableName}`)).rowCount > 0;
}

export { pool };
