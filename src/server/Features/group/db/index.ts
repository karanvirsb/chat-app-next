import { makeDb } from "../data-access";
import dotenv from "dotenv";
dotenv.config();

export default async function setupGroupDb() {
  console.log("setting up group database...");
  // database will be created if it doesnt exist already
  try {
    const db = await makeDb();
    const result = await db.query(`
      CREATE TABLE IF NOT EXISTS groupt (
        "groupId" VARCHAR(50) PRIMARY KEY NOT NULL UNIQUE, 
        "groupName" VARCHAR(50) NOT NULL, 
        "inviteCode" VARCHAR(10) UNIQUE,
        "dateCreated" timestamp
      );
      
      CREATE TABLE IF NOT EXISTS "groupUsers" (
        "gId" VARCHAR(100) REFERENCES groupt("groupId") ON DELETE CASCADE ON UPDATE CASCADE,
        "uId" VARCHAR(100) REFERENCES usert("userId") ON UPDATE CASCADE ON DELETE CASCADE,
        roles TEXT [],
        PRIMARY KEY ("gId", "uId")
      );
    `);
    // console.log(
    //     "🚀 ~ file: index.ts ~ line 24 ~ setupGroupDb ~ result",
    //     result
    // );
    console.log("Group Database set up complete...");
  } catch (err) {
    console.log("Group DB ERROR:", err);
  }
}
