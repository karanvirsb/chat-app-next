import { Pool, PoolClient } from "pg";

export interface IGroupUsersDb {
  makeDb: () => Promise<PoolClient>;
}

const pool = new Pool({}); // configure to add group

export async function makeDb() {
  return await pool.connect();
}

// const groupDb = makeGroupDb({ makeDb });

// export default groupDb;
