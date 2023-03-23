import { IGroupChannelDb } from ".";
import { IGroupChannel } from "../groupChannel";

type props = {
    makeDb: IGroupChannelDb["makeDb"];
};

type returningChannelData = Promise<{
    success: boolean;
    data: IGroupChannel | undefined;
    error: string;
}>;

type returningChannelsData = Promise<{
    success: boolean;
    data: IGroupChannel[] | undefined;
    error: string;
}>;

export interface IMakeChannelDb {
    returnType: Readonly<{
        createChannel: (
            channelInfo: IGroupChannel
        ) => Promise<returningChannelData>;
        deleteChannel: (channelId: string) => Promise<returningChannelData>;
        updateChannelName: (
            channelId: string,
            newName: string
        ) => Promise<returningChannelData>;
        getChannelById: (channelId: string) => Promise<returningChannelData>;
        getChannelsByGroupId: (
            groupId: string
        ) => Promise<returningChannelsData>;
    }>;
}

export default function makeChannelDb({
    makeDb,
}: props): IMakeChannelDb["returnType"] {
    return Object.freeze({
        createChannel,
        deleteChannel,
        updateChannelName,
        getChannelById,
        getChannelsByGroupId,
    });

    // create channel (channelInfo);
    async function createChannel(
        channelInfo: IGroupChannel
    ): Promise<returningChannelData> {
        const db = await makeDb();
        try {
            const query = `INSERT INTO group_channels VALUES (
                '${channelInfo.channelId}', 
                '${channelInfo.channelName}', 
                to_timestamp(${channelInfo.dateCreated.getTime()}/1000), 
                '${channelInfo.groupId}'
                ) RETURNING *;`;
            const res = await db.query(query);

            if (res.rowCount === 1) {
                const channel: IGroupChannel = res.rows[0];
                channel.dateCreated = new Date(channel.dateCreated);
                return { success: true, data: channel, error: "" };
            } else {
                return {
                    success: true,
                    data: undefined,
                    error: "Could not create the channel.",
                };
            }
        } catch (error) {
            console.log(
                "🚀 ~ file: channel-db.ts ~ line 54 ~ error ~ createChannel",
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
    // delete channel (channelId);
    async function deleteChannel(
        channelId: string
    ): Promise<returningChannelData> {
        const db = await makeDb();
        try {
            const query = `DELETE FROM group_channels WHERE "channelId" = '${channelId}' RETURNING *;`;
            const res = await db.query(query);

            if (res.rowCount === 1) {
                const channel: IGroupChannel = res.rows[0];
                return { success: true, data: channel, error: "" };
            } else {
                return {
                    success: true,
                    data: undefined,
                    error: "Could not delete the channel.",
                };
            }
        } catch (error) {
            console.log(
                "🚀 ~ file: channel-db.ts ~ line 84 ~ error ~ deleteChannel",
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

    // update channelName (channelId, newName);
    async function updateChannelName(
        channelId: string,
        newName: string
    ): Promise<returningChannelData> {
        const db = await makeDb();
        try {
            const query = `UPDATE group_channels 
                SET "channelName" = '${newName}' 
                WHERE "channelId" = '${channelId}' 
                RETURNING *;`;
            const res = await db.query(query);

            if (res.rowCount === 1) {
                const channel: IGroupChannel = res.rows[0];
                channel.dateCreated = new Date(channel.dateCreated);
                return { success: true, data: channel, error: "" };
            } else {
                return {
                    success: true,
                    data: undefined,
                    error: "Could not update the channel.",
                };
            }
        } catch (error) {
            console.log(
                "🚀 ~ file: channel-db.ts ~ line 125 ~ error ~ updateChannelName",
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
    // get channel by Id (channelId);
    async function getChannelById(
        channelId: string
    ): Promise<returningChannelData> {
        const db = await makeDb();
        try {
            const query = `SELECT * FROM group_channels WHERE "channelId" = '${channelId}';`;
            const res = await db.query(query);

            if (res.rowCount === 1) {
                const channel: IGroupChannel = res.rows[0];
                channel.dateCreated = new Date(channel.dateCreated);
                return { success: true, data: channel, error: "" };
            } else {
                return {
                    success: true,
                    data: undefined,
                    error: "Could not find the channel.",
                };
            }
        } catch (error) {
            console.log(
                "🚀 ~ file: channel-db.ts ~ line 165 ~ error ~ getChannelById",
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
    // get Channels by group Id (groupId);
    async function getChannelsByGroupId(
        groupId: string
    ): Promise<returningChannelsData> {
        const db = await makeDb();
        try {
            const query = `
            SELECT * FROM group_channels 
            WHERE "groupId" = '${groupId}'
            ORDER BY "dateCreated" ASC;`;
            const res = await db.query(query);

            if (res.rowCount >= 1) {
                const channels: IGroupChannel[] = res.rows;
                for (const channel of channels) {
                    channel.dateCreated = new Date(channel.dateCreated);
                }
                return { success: true, data: channels, error: "" };
            } else {
                return {
                    success: true,
                    data: undefined,
                    error: "Could not find channels with that groupId.",
                };
            }
        } catch (error) {
            console.log(
                "🚀 ~ file: channel-db.ts ~ line 209 ~ error ~ getChannelsById",
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
