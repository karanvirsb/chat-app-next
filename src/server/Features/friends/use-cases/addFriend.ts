import { IMakeFriendsDb } from "../data-access/friends-db";
import { IFriends } from "../friends";
import makeFriends from "../index";

type props = {
  friendsDb: IMakeFriendsDb["returnType"];
};

export interface IAddFriendsUseCase {
  addFriend: (
    userId: string,
    friendId: string
  ) => Promise<UseCaseReturn<IFriends>>;
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

    if (!friends.success) return friends;

    const foundFriends = await friendsDb.getAFriend(userId, friendId);

    if (foundFriends.success && foundFriends.data !== undefined) {
      throw Error("User is already friends.");
    }

    return await friendsDb.addFriend({
      userId: friends.data.getUserId(),
      friendId: friends.data.getFriendId(),
      dateAdded: friends.data.getDateAdded(),
    });
  };
}
