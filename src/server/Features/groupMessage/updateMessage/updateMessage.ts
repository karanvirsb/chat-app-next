import { z } from "zod";
import { IGroupMessageDb } from "../data-access";
import { IGroupMessage, GroupMessageSchema } from "../groupMessage";
import DBUpdateStr from "@/server/Utilities/DBUpdateString";

const UpdateMessageSchema = z.object({
  messageId: GroupMessageSchema.shape.messageId,
  updates: GroupMessageSchema.omit({
    channelId: true,
    messageId: true,
    dateCreated: true,
    replyTo: true,
    userId: true,
  }).partial(),
});
type UpdateMessage = z.infer<typeof UpdateMessageSchema>;

export function makeUpdateGroupMessageUC({
  updateGroupMessageDBA,
}: {
  updateGroupMessageDBA: ({
    messageId,
    updates,
  }: UpdateMessage) => Promise<DBAccessReturn<IGroupMessage>>;
}) {
  return async function updateGroupMessageUC({
    messageId,
    updates,
  }: UpdateMessage): Promise<UseCaseReturn<IGroupMessage>> {
    const result = UpdateMessageSchema.safeParse({ messageId, updates });

    if (!result.success) {
      return { success: false, error: result.error };
    }

    return await updateGroupMessageDBA({ messageId, updates });
  };
}

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
    updates["dateModified"] = new Date();
    const updateStr = DBUpdateStr(updates);

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
