require("dotenv").config();
import makePrivateMessageDb from "./privateMessage-db";
import { Pool, PoolClient } from "pg";

export interface IPrivateMessageDb {
    makeDb: () => Promise<PoolClient>;
}

const pool = new Pool({}); // configure to add message

export async function makeDb() {
    return await pool.connect();
}

const privateMessageDb = makePrivateMessageDb({ makeDb });

export default privateMessageDb;
