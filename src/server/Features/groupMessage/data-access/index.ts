require("dotenv").config();
import makeMessageDb from "./message-db";
import { Pool, PoolClient } from "pg";

export interface IGroupMessageDb {
    makeDb: () => Promise<PoolClient>;
}

const pool = new Pool({}); // configure to add message

export async function makeDb() {
    return await pool.connect();
}

const messageDb = makeMessageDb({ makeDb });

export default messageDb;
