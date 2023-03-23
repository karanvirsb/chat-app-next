import makeFriends from "../index";
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

export interface IAddFriendsUseCase {
    addFriend: (userId: string, friendId: string) => returnData;
}

export default function makeAddFriend({
    friendsDb,
}: props): IAddFriendsUseCase["addFriend"] {
    return async function addFriend(userId: string, friendId: string) {
        const friends = makeFriends({
            userId,
            friendId,
            dateAdded: new Date(),
        });
        const foundFriends = await friendsDb.getAFriend(userId, friendId);

        if (foundFriends.success && foundFriends.data !== undefined) {
            throw Error("User is already friends.");
        }

        return await friendsDb.addFriend({
            userId: friends.getUserId(),
            friendId: friends.getFriendsId(),
            dateAdded: friends.getDateAdded(),
        });
    };
}
