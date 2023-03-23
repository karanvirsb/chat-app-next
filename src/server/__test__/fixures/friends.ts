import { IFriends } from "../../src/Features/friends/friends";

export default async function makeFakeFriends(
    userId: string,
    friendId: string
): Promise<IFriends> {
    return {
        userId,
        friendId,
        dateAdded: new Date(),
    };
}
