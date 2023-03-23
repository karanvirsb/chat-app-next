import { IMakeFriendsDb } from "../data-access/friends-db";
import { IFriends } from "../friends";

type props = {
    friendsDb: IMakeFriendsDb["returnType"];
};

type returnData = Promise<{
    success: boolean;
    data: undefined | IFriends[];
    error: string;
}>;

export interface IGetFriendsUseCase {
    getFriends: (userId: string) => returnData;
}

export default function makeGetFriends({
    friendsDb,
}: props): IGetFriendsUseCase["getFriends"] {
    return async function getFriends(userId: string) {
        if (!userId) throw Error("User Id needs to be supplied.");

        return await friendsDb.getFriends(userId);
    };
}
