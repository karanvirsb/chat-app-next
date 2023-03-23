import { IMakePrivateChannelDb } from "../data-access/privateChannel-db";
import { IPrivateChannel } from "../privateChannel";

type props = {
    privateChannelDb: IMakePrivateChannelDb["returnType"];
};

type returnData = Promise<{
    success: boolean;
    data: IPrivateChannel[] | undefined;
    error: string;
}>;

export interface IGetPrivateChannelsByUserIdUseCase {
    getPrivateChannelsByUserId: (userId: string) => Promise<returnData>;
}

export default function makeGetPrivateChannelsByUserId({
    privateChannelDb,
}: props): IGetPrivateChannelsByUserIdUseCase["getPrivateChannelsByUserId"] {
    return async function getPrivateChannelsByUserId(
        userId: string
    ): Promise<returnData> {
        if (!userId) throw new Error("User Id needs to be supplied");

        return await privateChannelDb.getPrivateChannelsByUserId(userId);
    };
}
