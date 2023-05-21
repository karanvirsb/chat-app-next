import { EntityReturn } from "@/shared/types/returns";

export interface IFriends {
  userId: string;
  friendId: string;
  dateAdded: Date;
}

export default function buildFriends() {
  return function makeFriends({
    userId,
    friendId,
    dateAdded = new Date(),
  }: IFriends): EntityReturn<IFriends> {
    if (!userId) throw new Error("User Id needs to be supplied");
    if (!friendId) throw new Error("Friends Id needs to be supplied");
    if (!dateAdded || Number.isNaN(dateAdded.getTime()))
      throw new Error("Date needs to be supplied");
    return {
      success: true,
      data: Object.freeze({
        getUserId: () => userId,
        getFriendId: () => friendId,
        getDateAdded: () => dateAdded,
      }),
    };
  };
}
