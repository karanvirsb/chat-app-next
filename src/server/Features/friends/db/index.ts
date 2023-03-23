import { makeDb } from "../data-access";
import dotenv from "dotenv";
dotenv.config();

export default async function setupFriendsDb() {
  console.log("setting up friends database...");
  // database will be created if it doesnt exist already
  try {
    const db = await makeDb();
    const result = await db.query(`
    CREATE TABLE IF NOT EXISTS friends(
      "userId" VARCHAR(100) REFERENCES usert("userId") ON DELETE CASCADE ON UPDATE CASCADE, 
      "friendId" VARCHAR(100) REFERENCES usert("userId") ON DELETE SET NULL, 
      dateAdded timestamp, 
      PRIMARY KEY("userId", "friendId")
    );
  `);
    // console.log(
    //     "🚀 ~ file: index.ts ~ line 24 ~ setupFriendsDb ~ result",
    //     result
    // );
    console.log("Friends Database set up complete...");
  } catch (err) {
    console.log("Friends DB ERROR: ", err);
  }
}
