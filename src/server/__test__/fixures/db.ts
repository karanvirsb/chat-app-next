require("dotenv").config();
import { Pool } from "pg";

const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.TEST_DATABASE,
    password: process.env.PGPASSWORD,
    port: parseInt(process.env.PGPORT ?? "3211"),
});

export default async function makeDb() {
    return await pool.connect();
}

export async function closeDb() {
    await pool.end();
}

export async function clearDb(tableName: string) {
    return (await (await pool.query(`DELETE FROM ${tableName}`)).rowCount) > 0;
}

export { pool };
