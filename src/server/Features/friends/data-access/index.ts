require("dotenv").config();
import makeFriendsDb from "./friends-db";

import { Pool, PoolClient } from "pg";

export interface IFriendsDb {
    makeDb: () => Promise<PoolClient>;
}

const pool = new Pool({});

export async function makeDb() {
    return await pool.connect();
}

const friendsDb = makeFriendsDb({ makeDb });

export default friendsDb;
