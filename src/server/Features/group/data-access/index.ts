require("dotenv").config();
import makeGroupDb from "./group-db";
import { Pool, PoolClient } from "pg";

export interface IGroupDb {
    makeDb: () => Promise<PoolClient>;
}

const pool = new Pool({}); // configure to add group

export async function makeDb() {
    return await pool.connect();
}

const groupDb = makeGroupDb({ makeDb });

export default groupDb;
