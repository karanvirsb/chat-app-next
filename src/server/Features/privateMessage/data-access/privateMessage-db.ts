import { IPrivateMessageDb } from ".";
import { IPrivateMessage } from "../privateMessage";

type props = {
    makeDb: IPrivateMessageDb["makeDb"];
};

type returningMessageData = Promise<{
    success: boolean;
    data: IPrivateMessage | undefined;
    error: string;
}>;

type returningMessagesData = Promise<{
    success: boolean;
    data: IPrivateMessage[] | undefined;
    error: string;
}>;

export interface IMakePrivateMessageDb {
    returnType: Readonly<{
        createPrivateMessage: (
            messageInfo: IPrivateMessage
        ) => Promise<returningMessageData>;
        deletePrivateMessage: (
            messageId: string
        ) => Promise<returningMessageData>;
        getPrivateMessageById: (
            messageId: string
        ) => Promise<returningMessageData>;
        getPrivateMessagesByChannelId: (
            channelId: string,
            dateCreated: Date,
            limit: number
        ) => Promise<returningMessagesData>;
        updatePrivateMessage: (
            updateName: keyof IPrivateMessage,
            messageId: string,
            updateValue: IPrivateMessage[typeof updateName]
        ) => Promise<returningMessageData>;
    }>;
}

export default function makePrivateMessageDb({
    makeDb,
}: props): IMakePrivateMessageDb["returnType"] {
    return Object.freeze({
        createPrivateMessage,
        deletePrivateMessage,
        getPrivateMessageById,
        getPrivateMessagesByChannelId,
        updatePrivateMessage,
    });

    // create message
    async function createPrivateMessage(
        messageInfo: IPrivateMessage
    ): Promise<returningMessageData> {
        const db = await makeDb();
        try {
            const query = `INSERT INTO private_messages VALUES (
                '${messageInfo.messageId}',
                to_timestamp(${messageInfo.dateCreated.getTime()}/1000),
                null,
                ${messageInfo.replyTo ? `'${messageInfo.replyTo}'` : null},
                '${messageInfo.text}', 
                '${messageInfo.userId}', 
                '${messageInfo.privateChannelId}'
                ) RETURNING *;`;
            const res = await db.query(query);

            if (res.rowCount === 1) {
                const message: IPrivateMessage = res.rows[0];
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
                "🚀 ~ file: message-db.ts ~ line 79 ~ error ~ createPrivateMessage",
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
    async function deletePrivateMessage(
        messageId: string
    ): Promise<returningMessageData> {
        const db = await makeDb();
        try {
            const query = `DELETE FROM private_messages WHERE "messageId" = '${messageId}' RETURNING *;`;
            const res = await db.query(query);

            if (res.rowCount === 1) {
                const message: IPrivateMessage = res.rows[0];
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
                "🚀 ~ file: message-db.ts ~ line 113 ~ error ~ deletePrivateMessage",
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

    async function getPrivateMessageById(
        messageId: string
    ): Promise<returningMessageData> {
        const db = await makeDb();
        try {
            const query = `SELECT * FROM private_messages WHERE "messageId" = '${messageId}';`;
            const res = await db.query(query);

            if (res.rowCount === 1) {
                const message: IPrivateMessage = res.rows[0];
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
                "🚀 ~ file: message-db.ts ~ line 148 ~ error ~ getPrivateMessageById",
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

    async function getPrivateMessagesByChannelId(
        privateChannelId: string,
        dateCreated: Date,
        limit: number
    ): Promise<returningMessagesData> {
        const db = await makeDb();
        try {
            const query = `
                SELECT * FROM private_messages 
                WHERE "privateChannelId" = '${privateChannelId}' AND "dateCreated" < to_timestamp(${
                dateCreated.getTime() / 1000
            }) 
                ORDER BY "dateCreated" DESC 
                LIMIT ${limit};`;
            const res = await db.query(query);

            if (res.rowCount >= 1) {
                const message: IPrivateMessage[] = res.rows;
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
                "🚀 ~ file: message-db.ts ~ line 191 ~ error ~ getPrivateMessagesByChannelId",
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
    async function updatePrivateMessage(
        updateName: Partial<keyof IPrivateMessage>,
        messageId: string,
        updateValue: IPrivateMessage[typeof updateName]
    ): Promise<returningMessageData> {
        const db = await makeDb();
        try {
            const query = `
            UPDATE private_messages 
            SET "${updateName}" = '${updateValue}' 
            WHERE "messageId" = '${messageId}' RETURNING *;`;

            const res = await db.query(query);

            if (res.rowCount === 1) {
                const message: IPrivateMessage = res.rows[0];
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
                "🚀 ~ file: message-db.ts ~ line 231 ~ error ~ updatePrivateMessage",
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
