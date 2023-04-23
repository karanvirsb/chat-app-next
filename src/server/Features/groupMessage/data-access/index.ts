import { Pool, PoolClient } from "pg";

import makeMessageDb from "./message-db";

export interface IGroupMessageDb {
  makeDb: () => Promise<PoolClient>;
}

const pool = new Pool({}); // configure to add message

export async function makeDb() {
  return await pool.connect();
}

const messageDb = makeMessageDb({ makeDb });

export default messageDb;
