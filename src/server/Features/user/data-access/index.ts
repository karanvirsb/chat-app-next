require("dotenv").config();
import makeUsersDb from "./users-db";
import { Pool, PoolClient } from "pg";

export interface IUserDb {
    makeDb: () => Promise<PoolClient>;
}

const pool = new Pool({});

export async function makeDb() {
    return await pool.connect();
}

const usersDb = makeUsersDb({ makeDb });

export default usersDb;
