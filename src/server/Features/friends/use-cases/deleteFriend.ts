import { IMakeFriendsDb } from "../data-access/friends-db";
import { IFriends } from "../friends";
import makeFriends from "../index";

type props = {
  friendsDb: IMakeFriendsDb["returnType"];
};

type returnData = Promise<{
  success: boolean;
  data: undefined | IFriends;
  error: string;
}>;

export interface IDeleteFriendsUseCase {
  deleteFriend: (userId: string, friendId: string) => returnData;
}

export default function makeDeleteFriend({
  friendsDb,
}: props): IDeleteFriendsUseCase["deleteFriend"] {
  return async function deleteFriend(userId: string, friendId: string) {
    if (!userId) throw Error("User Id needs to be supplied.");
    if (!friendId) throw Error("Friends Id needs to be supplied.");

    return await friendsDb.deleteFriend(userId, friendId);
  };
}
