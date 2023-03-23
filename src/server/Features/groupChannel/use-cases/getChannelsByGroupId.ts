import { IGroupChannel } from "../groupChannel";
import { IMakeChannelDb } from "../data-access/channel-db";

type props = {
    channelDb: IMakeChannelDb["returnType"];
};

type returnData = Promise<{
    success: boolean;
    data: IGroupChannel[] | undefined;
    error: string;
}>;

export interface IGetChannelsByGroupIdUseCase {
    getChannelsByGroupId: (groupId: string) => Promise<returnData>;
}

export default function makeGetChannelsByGroupId({
    channelDb,
}: props): IGetChannelsByGroupIdUseCase["getChannelsByGroupId"] {
    return async function getChannelsByGroupId(
        groupId: string
    ): Promise<returnData> {
        if (!groupId) throw new Error("Group Id needs to be supplied");

        return await channelDb.getChannelsByGroupId(groupId);
    };
}
