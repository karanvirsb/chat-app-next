import { IMakePrivateChannelDb } from "../data-access/privateChannel-db";
import makeChannel from "../index";
import { IPrivateChannel } from "../privateChannel";

export type handleModerationType = {
    (name: string): Promise<number | boolean>;
};

type props = {
    privateChannelDb: IMakePrivateChannelDb["returnType"];
    handleModeration: handleModerationType;
};

type returnData = Promise<{
    success: boolean;
    data: IPrivateChannel | undefined;
    error: string;
}>;

export interface ICreatePrivateChannelUseCase {
    createPrivateChannel: (channelInfo: IPrivateChannel) => Promise<returnData>;
}

export default function makeCreatePrivateChannel({
    handleModeration,
    privateChannelDb,
}: props): ICreatePrivateChannelUseCase["createPrivateChannel"] {
    return async function createPrivateChannel(
        channelInfo: IPrivateChannel
    ): Promise<returnData> {
        const channel = makeChannel(channelInfo);

        const moderatedName = await handleModeration(channel.getChannelName());

        if (moderatedName) {
            throw new Error("Channel name contains profanity");
        }

        if (moderatedName === -1) {
            throw new Error("Server Error, please try again.");
        }

        const privateChannelExists =
            await privateChannelDb.getPrivateChannelById(
                channel.getChannelId()
            );

        if (
            privateChannelExists.success &&
            privateChannelExists.data !== undefined
        ) {
            throw new Error("Private Channel already exists, try again.");
        }

        return await privateChannelDb.createPrivateChannel({
            channelId: channel.getChannelId(),
            channelName: channel.getChannelName(),
            dateCreated: channel.getDateCreated(),
            userId: channel.getUserId(),
            friendsId: channel.getFriendsId(),
            lastActive: channel.getLastActive(),
        });
    };
}
