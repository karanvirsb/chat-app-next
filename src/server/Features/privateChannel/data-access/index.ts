import { Pool, PoolClient } from "pg";

import makePrivateChannelDb from "./privateChannel-db";

export interface IPrivateChannelDb {
  makeDb: () => Promise<PoolClient>;
}

const pool = new Pool({}); // configure to add channels

export async function makeDb() {
  return await pool.connect();
}

const privateChannelDb = makePrivateChannelDb({ makeDb });

export default privateChannelDb;
