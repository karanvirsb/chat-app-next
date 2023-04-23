import { Pool, PoolClient } from "pg";

import makeChannelDb from "./channel-db";

export interface IGroupChannelDb {
  makeDb: () => Promise<PoolClient>;
}

const pool = new Pool({}); // configure to add group

export async function makeDb() {
  return await pool.connect();
}

const channelDb = makeChannelDb({ makeDb });

export default channelDb;
