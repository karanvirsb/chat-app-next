import { makeDb } from "../data-access";

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
