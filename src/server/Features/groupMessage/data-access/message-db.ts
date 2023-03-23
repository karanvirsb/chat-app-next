import { IGroupMessageDb } from ".";
import pagination, {
  Pagination,
} from "../../../Utilities/pagination/pagination";
import { IGroupMessage } from "../groupMessage";

type props = {
  makeDb: IGroupMessageDb["makeDb"];
};

type returningMessageData = Promise<{
  success: boolean;
  data: IGroupMessage | undefined;
  error: string;
}>;

export type returingPaginatedMessages = Promise<{
  success: boolean;
  data:
    | {
        hasNextPage: boolean;
        nextPage: string | null;
        data: IGroupMessage[];
      }
    | undefined;
  error: string;
}>;

type returningMessagesData = Promise<{
  success: boolean;
  data: IGroupMessage[] | undefined;
  error: string;
}>;

export interface IMakeMessageDb {
  returnType: Readonly<{
    createMessage: (
      messageInfo: IGroupMessage
    ) => Promise<returningMessageData>;
    deleteMessage: (messageId: string) => Promise<returningMessageData>;
    getMessageById: (messageId: string) => Promise<returningMessageData>;
    getMessagesByChannelId: (
      channelId: string,
      dateCreated: Date,
      limit: number
    ) => returingPaginatedMessages;
    updateMessage: (
      updateName: keyof IGroupMessage,
      messageId: string,
      updateValue: IGroupMessage[typeof updateName]
    ) => Promise<returningMessageData>;
  }>;
}

export default function makeMessageDb({
  makeDb,
}: props): IMakeMessageDb["returnType"] {
  return Object.freeze({
    createMessage,
    deleteMessage,
    getMessageById,
    getMessagesByChannelId,
    updateMessage,
  });

  // create message
  async function createMessage(
    messageInfo: IGroupMessage
  ): Promise<returningMessageData> {
    const db = await makeDb();
    try {
      const query = `INSERT INTO group_messages VALUES (
                '${messageInfo.messageId}',
                to_timestamp(${messageInfo.dateCreated.getTime()}/1000),
                null,
                ${messageInfo.replyTo ? `'${messageInfo.replyTo}'` : null},
                E'${messageInfo.text}', 
                '${messageInfo.userId}', 
                '${messageInfo.channelId}'
                ) RETURNING *;`;
      const res = await db.query(query);

      if (res.rowCount === 1) {
        const message: IGroupMessage = res.rows[0];
        message.dateCreated = new Date(message.dateCreated);
        return { success: true, data: message, error: "" };
      } else {
        return {
          success: true,
          data: undefined,
          error: "Could not create the message.",
        };
      }
    } catch (error) {
      console.log(
        "🚀 ~ file: message-db.ts ~ line 79 ~ error ~ createMessage",
        error
      );
      return {
        success: false,
        data: undefined,
        error: error + "",
      };
    } finally {
      db.release();
    }
  }
  // delete message
  async function deleteMessage(
    messageId: string
  ): Promise<returningMessageData> {
    const db = await makeDb();
    try {
      const query = `DELETE FROM group_messages WHERE "messageId" = '${messageId}' RETURNING *;`;
      const res = await db.query(query);

      if (res.rowCount === 1) {
        const message: IGroupMessage = res.rows[0];
        message.dateCreated = new Date(message.dateCreated);
        return { success: true, data: message, error: "" };
      } else {
        return {
          success: true,
          data: undefined,
          error: "Could not delete the message.",
        };
      }
    } catch (error) {
      console.log(
        "🚀 ~ file: message-db.ts ~ line 113 ~ error ~ deleteMessage",
        error
      );
      return {
        success: false,
        data: undefined,
        error: error + "",
      };
    } finally {
      db.release();
    }
  }
  // get message by id

  async function getMessageById(
    messageId: string
  ): Promise<returningMessageData> {
    const db = await makeDb();
    try {
      const query = `SELECT * FROM group_messages WHERE "messageId" = '${messageId}';`;
      const res = await db.query(query);

      if (res.rowCount === 1) {
        const message: IGroupMessage = res.rows[0];
        message.dateCreated = new Date(message.dateCreated);
        return { success: true, data: message, error: "" };
      } else {
        return {
          success: true,
          data: undefined,
          error: "Could not find the message.",
        };
      }
    } catch (error) {
      console.log(
        "🚀 ~ file: message-db.ts ~ line 148 ~ error ~ getMessageById",
        error
      );
      return {
        success: false,
        data: undefined,
        error: error + "",
      };
    } finally {
      db.release();
    }
  }

  // get messages by channel id

  async function getMessagesByChannelId(
    channelId: string,
    dateCreated: Date,
    limit: number
  ): returingPaginatedMessages {
    console.log(dateCreated);
    const db = await makeDb();
    try {
      const query = `
      SELECT
      (
        SELECT COUNT(*) 
          FROM group_messages
          WHERE "channelId" = '${channelId}' AND "dateCreated" < to_timestamp(${
        dateCreated.getTime() / 1000
      })
      ) as count,
      (
        SELECT json_agg(t.*) FROM (
          SELECT * FROM group_messages 
          WHERE "channelId" = '${channelId}' AND "dateCreated" < to_timestamp(${
        dateCreated.getTime() / 1000
      }) 
          ORDER BY "dateCreated" DESC
          LIMIT ${limit + 1}
          ) as t
      ) AS rows
`;
      const res = await db.query(query);

      if (res.rowCount >= 1) {
        const message: { count: number; rows: IGroupMessage[] } = res.rows[0];

        const paginatedData = pagination<IGroupMessage>({
          prevDate: message.rows[limit - 2]?.dateCreated ?? null,
          nextDate: message.rows[limit - 1]?.dateCreated ?? null,
          rows: message.rows.reverse(),
        });

        const nextPage = `${process.env.API_DOMAIN}/groupMessage/channel/messages?channelId=${channelId}&limit=${limit}&dateCreated=${paginatedData.cursor}`;
        return {
          success: true,
          data: {
            nextPage: paginatedData.hasNextPage ? nextPage : null,
            data: paginatedData.data,
            hasNextPage: paginatedData.hasNextPage,
          },
          error: "",
        };
      } else {
        return {
          success: true,
          data: undefined,
          error: "Could not find the message.",
        };
      }
    } catch (error) {
      console.log(
        "🚀 ~ file: message-db.ts ~ line 191 ~ error ~ getMessagesByChannelId",
        error
      );
      return {
        success: false,
        data: undefined,
        error: error + "",
      };
    } finally {
      db.release();
    }
  }
  // update message
  async function updateMessage(
    updateName: Partial<keyof IGroupMessage>,
    messageId: string,
    updateValue: IGroupMessage[typeof updateName]
  ): Promise<returningMessageData> {
    const db = await makeDb();
    try {
      const query = `
            UPDATE group_messages 
            SET "${updateName}" = E'${updateValue}' 
            WHERE "messageId" = '${messageId}' RETURNING *;`;

      const res = await db.query(query);

      if (res.rowCount === 1) {
        const message: IGroupMessage = res.rows[0];
        message.dateCreated = new Date(message.dateCreated);
        return { success: true, data: message, error: "" };
      } else {
        return {
          success: true,
          data: undefined,
          error: "Could not find the message.",
        };
      }
    } catch (error) {
      console.log(
        "🚀 ~ file: message-db.ts ~ line 231 ~ error ~ updateMessage",
        error
      );
      return {
        success: false,
        data: undefined,
        error: error + "",
      };
    } finally {
      db.release();
    }
  }
}
