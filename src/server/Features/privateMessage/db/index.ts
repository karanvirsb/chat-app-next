import { makeDb } from "../data-access";
import dotenv from "dotenv";
dotenv.config();

export default async function setupPrivateMessageDb() {
  console.log("setting up private message database...");
  // database will be created if it doesnt exist already
  try {
    const db = await makeDb();
    const result = await db.query(
      `CREATE TABLE IF NOT EXISTS private_messages (
            "messageId" VARCHAR(100) PRIMARY KEY,
            "dateCreated" timestamp,
            "dateModified" timestamp,
            "replyTo" VARCHAR(100) references private_messages("messageId"),
            text VARCHAR(200),
            "userId" VARCHAR(100) REFERENCES usert("userId"),
            "privateChannelId" VARCHAR(100) REFERENCES private_channels("channelId") ON DELETE CASCADE
          );`
    );

    // console.log(
    //     "🚀 ~ file: index.ts ~ line 20 ~ setupPrivateMessageDb ~ result",
    //     result
    // );

    console.log("Private Message Database set up complete...");
  } catch (error) {
    console.log("Private Message DB ERROR", error);
  }
}
