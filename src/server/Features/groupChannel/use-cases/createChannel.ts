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

export interface ICreateChannelUseCase {
    createChannel: (channelInfo: IGroupChannel) => Promise<returnData>;
}

export default function makeCreateChannel({
    handleModeration,
    channelDb,
}: props): ICreateChannelUseCase["createChannel"] {
    return async function createChannel(
        channelInfo: IGroupChannel
    ): Promise<returnData> {
        if (!channelInfo.channelName)
            throw new Error("Channel name needs to be supplied");
        if (!channelInfo.groupId)
            throw new Error("Group Id needs to be supplied");

        const channel = makeChannel(channelInfo);

        const moderatedName = await handleModeration(channel.getChannelName());

        if (moderatedName) {
            throw new Error("Channel name contains profanity");
        }

        if (moderatedName === -1) {
            throw new Error("Server Error, please try again.");
        }

        const channelExists = await channelDb.getChannelById(
            channel.getChannelId()
        );

        if (channelExists.success && channelExists.data !== undefined) {
            throw new Error("Channel already exists, try again.");
        }

        return await channelDb.createChannel({
            channelId: channel.getChannelId(),
            channelName: channel.getChannelName(),
            dateCreated: channel.getDateCreated(),
            groupId: channel.getGroupId(),
        });
    };
}
