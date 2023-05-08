import { z } from "zod";

import { EntityReturn } from "@/shared/types/returns";

import { IId } from "../../Utilities/id";

export const GroupMessageSchema = z.object({
  userId: z.string().uuid(),
  dateCreated: z.date(),
  messageId: z.string().uuid(),
  dateModified: z.date().optional(),
  replyTo: z.string().uuid().optional(),
  text: z
    .string()
    .min(3, "Text must be at least 3 characters long")
    .max(200, "Text must be less than 200 characters long"),
  channelId: z.string().uuid(),
});

export type IGroupMessage = z.infer<typeof GroupMessageSchema>;
// export type IGroupMessage {
//   userId: string;
//   dateCreated: Date;
//   messageId: string;
//   dateModified?: Date;
//   replyTo?: string;
//   text: string;
//   channelId: string;
// }

type returnEntity = Readonly<{
  getUserId: () => IGroupMessage["userId"];
  getDateCreated: () => IGroupMessage["dateCreated"];
  getMessageId: () => IGroupMessage["messageId"];
  getDateModified: () => IGroupMessage["dateModified"];
  getReplyTo: () => IGroupMessage["replyTo"];
  getText: () => IGroupMessage["text"];
  getChannelId: () => IGroupMessage["channelId"];
}>;

type props = {
  Id: IId;
  sanitizeText: (text: string) => string;
};

export default function buildMessage({ Id, sanitizeText }: props) {
  return function makeMessage({
    messageId,
    dateCreated,
    dateModified,
    replyTo,
    text,
    userId,
    channelId,
  }: IGroupMessage): EntityReturn<returnEntity> {
    const sanitizedText = sanitizeText(text);

    const message: IGroupMessage = {
      messageId: messageId.length <= 128 ? Id.makeId() : messageId,
      dateCreated: !dateCreated ? new Date() : dateCreated,
      dateModified,
      replyTo,
      text: sanitizedText,
      userId,
      channelId,
    };

    const result = GroupMessageSchema.safeParse(message);

    if (!result.success) {
      return { success: false, error: result.error };
    }

    // if (!text) throw new Error("Text needs to be supplied.");
    // if (sanitizedText.length < 1)
    //   throw new Error("Enter valid characters to send a message.");

    // if (sanitizedText.length < 1 || sanitizedText.length > 200)
    //   throw new Error("Messages can only be between 1 and 200 characters long");

    // if (!userId) throw new Error("User Id needs to be supplied.");
    // if (!dateCreated) throw new Error("Date Created needs to be supplied.");
    // if (!messageId) throw new Error("Message Id needs to be supplied.");
    // if (!channelId) throw new Error("Channel Id needs to be supplied.");

    // replace any ' with a '' to escape
    const newText = sanitizedText.replace(/'/g, "\\'");

    return {
      success: true,
      data: Object.freeze({
        getUserId: () => message.userId,
        getDateCreated: () => message.dateCreated,
        getMessageId: () => message.messageId,
        getDateModified: () => message.dateModified,
        getReplyTo: () => message.replyTo,
        getText: () => newText,
        getChannelId: () => message.channelId,
      }),
    };
  };
}
