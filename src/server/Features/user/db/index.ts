import { makeDb } from "../data-access";
import dotenv from "dotenv";
dotenv.config();

export default async function setupUserDb() {
  console.log("setting up user database...");
  // database will be created if it doesnt exist already

  const db = await makeDb();
  const result = await db.query(`
    CREATE TABLE IF NOT EXISTS usert (
      "userId" VARCHAR(100) REFERENCES emailpassword_users(user_id) ON DELETE CASCADE ON UPDATE CASCADE PRIMARY KEY,
      username VARCHAR(50) UNIQUE, 
      status VARCHAR(50));
  `);
  // console.log("🚀 ~ file: index.ts ~ line 24 ~ setupUserDb ~ result", result);
  console.log("User Database set up complete...", result);
}
