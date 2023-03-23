require("dotenv").config();
import makeSupertokensDb from "./supertokens-db";
import { Pool, PoolClient } from "pg";

export interface ISupertokensDb {
    makeDb: () => Promise<PoolClient>;
}

const pool = new Pool({}); // configure to add group

export async function makeDb() {
    return await pool.connect();
}

const supertokensDb = makeSupertokensDb({ makeDb });

export default supertokensDb;
