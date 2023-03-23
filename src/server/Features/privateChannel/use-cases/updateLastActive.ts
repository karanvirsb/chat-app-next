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

export interface IUpdateLastActiveUseCase {
    updateLastActive: (channelId: string, newDate: Date) => Promise<returnData>;
}

export default function makeUpdateLastActive({
    privateChannelDb,
}: props): IUpdateLastActiveUseCase["updateLastActive"] {
    return async function updateLastActive(
        channelId: string,
        newDate: Date
    ): Promise<returnData> {
        if (!channelId) throw Error("Channel Id needs to be supplied.");
        if (!newDate || Number.isNaN(newDate.getTime()))
            throw Error("New Date is not a valid date.");
        return await privateChannelDb.updateLastActive(channelId, newDate);
    };
}
