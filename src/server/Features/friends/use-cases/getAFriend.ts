import { IMakeFriendsDb } from "../data-access/friends-db";
import { IFriends } from "../friends";

type props = {
    friendsDb: IMakeFriendsDb["returnType"];
};

type returnData = Promise<{
    success: boolean;
    data: undefined | IFriends;
    error: string;
}>;

export interface IGetAFriendUseCase {
    getAFriend: (userId: string, friendId: string) => returnData;
}

export default function makeGetAFriend({
    friendsDb,
}: props): IGetAFriendUseCase["getAFriend"] {
    return async function getAFriend(userId: string, friendId: string) {
        if (!userId) throw Error("User Id needs to be supplied.");
        if (!friendId) throw Error("Friends Id needs to be supplied.");

        return await friendsDb.getAFriend(userId, friendId);
    };
}
