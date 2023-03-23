import { IGroupChannel } from "../groupChannel";
import { IMakeChannelDb } from "../data-access/channel-db";
import makeChannel from "../index";

export type handleModerationType = {
    (name: string): Promise<number | boolean>;
};

type props = {
    channelDb: IMakeChannelDb["returnType"];
    handleModeration: handleModerationType;
};

type returnData = Promise<{
    success: boolean;
    data: IGroupChannel | undefined;
    error: string;
}>;

export interface IUpdateChannelNameUseCase {
    updateChannelName: (
        channelId: string,
        newName: string
    ) => Promise<returnData>;
}

export default function makeUpdateChannelName({
    handleModeration,
    channelDb,
}: props): IUpdateChannelNameUseCase["updateChannelName"] {
    return async function updateChannelName(
        channelId: string,
        newName: string
    ): Promise<returnData> {
        if (!channelId) throw new Error("Channel Id needs to be supplied");
        if (!newName) throw new Error("New Channel Name needs to be supplied");

        const moderatedName = await handleModeration(newName);

        if (moderatedName) {
            throw new Error("New Channel Name contains profanity");
        }

        if (moderatedName === -1) {
            throw new Error("Server Error, please try again.");
        }

        const updatedChannelName = newName.replace(/'/g, "''");

        return await channelDb.updateChannelName(channelId, updatedChannelName);
    };
}
