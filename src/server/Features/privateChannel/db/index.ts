import { makeDb } from "../data-access";
import dotenv from "dotenv";
dotenv.config();

export default async function setupPrivateChannelDb() {
  console.log("setting up private channel database...");
  // database will be created if it doesnt exist already
  try {
    const db = await makeDb();
    const result = await db.query(
      `CREATE TABLE IF NOT EXISTS private_channels(
                "channelId" VARCHAR(100) PRIMARY KEY,
                "channelName" VARCHAR(50),
                "dateCreated" timestamp,
                "userId" VARCHAR(100) REFERENCES usert("userId") ON DELETE CASCADE ON UPDATE CASCADE,
                "friendsId" VARCHAR(100) REFERENCES usert("userId") ON DELETE SET NULL ON UPDATE CASCADE,
                "lastActive" timestamp
                );
            `
    );
    // console.log(
    //     "🚀 ~ file: index.ts ~ line 20 ~ setupChannelDb ~ result",
    //     result
    // );

    console.log("Private channel Database set up complete...");
  } catch (error) {
    console.log("Private Channel DB ERROR", error);
  }
}
