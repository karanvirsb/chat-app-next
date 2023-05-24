import { z } from "zod";

import { EntityReturn } from "@/shared/types/returns";

const FriendsSchema = z.object({
  userId: z.string().uuid(),
  friendId: z.string().uuid(),
  dateAdded: z.date(),
});

export type IFriends = z.infer<typeof FriendsSchema>;

export default function buildFriends() {
  return function makeFriends({
    userId,
    friendId,
    dateAdded = new Date(),
  }: IFriends): EntityReturn<IFriends> {
    // if (!userId) throw new Error("User Id needs to be supplied");
    // if (!friendId) throw new Error("Friends Id needs to be supplied");
    // if (!dateAdded || Number.isNaN(dateAdded.getTime()))
    //   throw new Error("Date needs to be supplied");

    const result = FriendsSchema.safeParse({ userId, friendId, dateAdded });

    if (!result.success) {
      return result;
    }

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
