import { Pool, PoolClient } from "pg";

import makePrivateMessageDb from "./privateMessage-db";

export interface IPrivateMessageDb {
  makeDb: () => Promise<PoolClient>;
}

const pool = new Pool({}); // configure to add message

export async function makeDb() {
  return await pool.connect();
}

const privateMessageDb = makePrivateMessageDb({ makeDb });

export default privateMessageDb;
