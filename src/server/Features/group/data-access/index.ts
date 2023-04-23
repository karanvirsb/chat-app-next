import { Pool, PoolClient } from "pg";

import makeGroupDb from "./group-db";

export interface IGroupDb {
  makeDb: () => Promise<PoolClient>;
}

const pool = new Pool({}); // configure to add group

export async function makeDb() {
  return await pool.connect();
}

const groupDb = makeGroupDb({ makeDb });

export default groupDb;
