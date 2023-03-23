import { makeDb } from "../data-access";
import dotenv from "dotenv";
dotenv.config();

export default async function setupGroupDb() {
  console.log("setting up group users database...");
  // database will be created if it doesnt exist already
  try {
    const db = await makeDb();
    const result = await db.query(`
      CREATE TABLE IF NOT EXISTS "groupUsers" (
        "gId" VARCHAR(100) REFERENCES groupt("groupId") ON DELETE CASCADE ON UPDATE CASCADE,
        "uId" VARCHAR(100) REFERENCES usert("userId") ON UPDATE CASCADE ON DELETE CASCADE,
        roles TEXT [],
        "lastChecked" timestamp,
        PRIMARY KEY ("gId", "uId")
      );
    `);
    console.log("Group users Database set up complete...");
  } catch (err) {
    console.log("Group users DB ERROR:", err);
  }
}
