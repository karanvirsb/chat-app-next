import { IMakePrivateChannelDb } from "../data-access/privateChannel-db";
import { IPrivateChannel } from "../privateChannel";

type props = {
    privateChannelDb: IMakePrivateChannelDb["returnType"];
};

type returnData = Promise<{
    success: boolean;
    data: IPrivateChannel | undefined;
    error: string;
}>;

export interface IDeletePrivateChannelUseCase {
    deletePrivateChannel: (channelId: string) => Promise<returnData>;
}

export default function makeDeletePrivateChannel({
    privateChannelDb,
}: props): IDeletePrivateChannelUseCase["deletePrivateChannel"] {
    return async function deletePrivateChannel(
        channelId: string
    ): Promise<returnData> {
        if (!channelId) throw new Error("Channel Id needs to be supplied");

        return await privateChannelDb.deletePrivateChannel(channelId);
    };
}
