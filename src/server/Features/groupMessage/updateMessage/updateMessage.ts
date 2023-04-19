import { z } from "zod";
import { IGroupMessageDb } from "../data-access";
import { IGroupMessage, GroupMessageSchema } from "../groupMessage";
import DBUpdateStr from "@/server/Utilities/DBUpdateString";

const UpdateMessageSchema = z.object({
  messageId: GroupMessageSchema.shape.messageId,
  updates: GroupMessageSchema.partial().omit({
    channelId: true,
    messageId: true,
    dateCreated: true,
    replyTo: true,
    userId: true,
  }),
});
type UpdateMessage = z.infer<typeof UpdateMessageSchema>;
export function makeUpdateGroupMessageDBA({
  makeDb,
}: {
  makeDb: IGroupMessageDb["makeDb"];
}) {
  return async function updateGroupMessageDBA({
    messageId,
    updates,
  }: UpdateMessage): Promise<DBAccessReturn<IGroupMessage>> {
    const db = await makeDb();
    const newUpdates = (updates["dateModified"] = new Date());
    const updateStr = DBUpdateStr(newUpdates);

    const query = `
      UPDATE "group_messages" 
      SET ${updateStr} 
      WHERE "messageId" = '${messageId}' 
      RETURNING "channelId", "messageId", "dateCreated"::TIMESTAMP WITH TIME ZONE,
      "replyTo", "userId", "dateModified"::TIMESTAMP WITH TIME ZONE, text;
    `;

    try {
      const res = await db.query(query);
      if (res.rows.length >= 1) {
        return { success: true, data: res.rows[0] };
      }
      return { success: false, error: "Could not update the message." };
    } catch (error) {
      return { success: false, error: error };
    }
  };
}
