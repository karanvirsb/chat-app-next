import { IFriendsDb } from ".";
import { IFriends } from "../friends";

type props = {
    makeDb: IFriendsDb["makeDb"];
};

type returnData = Promise<{
    success: boolean;
    data: undefined | IFriends;
    error: string;
}>;

type returnFriends = Promise<{
    success: boolean;
    data: undefined | IFriends[];
    error: string;
}>;

export interface IMakeFriendsDb {
    returnType: Readonly<{
        addFriend: (friendInfo: IFriends) => returnData;
        deleteFriend: (userId: string, friendId: string) => returnData;
        getAFriend: (userId: string, friendId: string) => returnData;
        getFriends: (userId: string) => returnFriends;
    }>;
}

export default function makeFriendsDb({
    makeDb,
}: props): IMakeFriendsDb["returnType"] {
    return Object.freeze({ addFriend, deleteFriend, getAFriend, getFriends });

    async function addFriend(friendInfo: IFriends): returnData {
        const db = await makeDb();
        try {
            const query = `INSERT INTO friends VALUES (
                '${friendInfo.userId}',
                '${friendInfo.friendId}',
                to_timestamp(${friendInfo.dateAdded.getTime() / 1000})
            ) RETURNING *;`;
            const res = await db.query(query);

            if (res.rowCount === 1) {
                const friend: IFriends = res.rows[0];
                friend.dateAdded = new Date(friend.dateAdded);
                return { success: true, data: friend, error: "" };
            } else {
                return {
                    success: true,
                    data: undefined,
                    error: "Could not add friend.",
                };
            }
        } catch (error) {
            console.log(
                "🚀 ~ file: friends-db.ts ~ line 39 ~ addFriend ~ error",
                error
            );

            return {
                success: false,
                data: undefined,
                error: error + "",
            };
        } finally {
            db.release();
        }
    }

    async function deleteFriend(userId: string, friendId: string): returnData {
        const db = await makeDb();
        try {
            const query = `DELETE FROM friends WHERE "userId" = '${userId}' AND "friendId" = '${friendId}' RETURNING *;`;
            const res = await db.query(query);

            if (res.rowCount === 1) {
                const friend: IFriends = res.rows[0];
                return { success: true, data: friend, error: "" };
            } else {
                return {
                    success: true,
                    data: undefined,
                    error: "Could not delete friend.",
                };
            }
        } catch (error) {
            console.log(
                "🚀 ~ file: friends-db.ts ~ line 87 ~ deleteFriend ~ error",
                error
            );

            return {
                success: false,
                data: undefined,
                error: error + "",
            };
        } finally {
            db.release();
        }
    }

    async function getAFriend(userId: string, friendId: string): returnData {
        const db = await makeDb();
        try {
            const query = `
            SELECT * FROM friends 
            WHERE "userId" = '${userId}' AND "friendId" = '${friendId}';`;
            const res = await db.query(query);

            if (res.rowCount === 1) {
                const friends: IFriends = res.rows[0];
                return { success: true, data: friends, error: "" };
            } else {
                return {
                    success: true,
                    data: undefined,
                    error: "Could not find friends.",
                };
            }
        } catch (error) {
            console.log(
                "🚀 ~ file: friends-db.ts ~ line 122 ~ getAFriend ~ error",
                error
            );

            return {
                success: false,
                data: undefined,
                error: error + "",
            };
        } finally {
            db.release();
        }
    }

    async function getFriends(userId: string): returnFriends {
        const db = await makeDb();
        try {
            const query = `
            SELECT * FROM friends 
            WHERE "userId" = '${userId}'
            ORDER BY "dateAdded" ASC`;
            const res = await db.query(query);

            if (res.rowCount >= 1) {
                const friends: IFriends[] = res.rows;
                return { success: true, data: friends, error: "" };
            } else {
                return {
                    success: true,
                    data: undefined,
                    error: "Could not find friends.",
                };
            }
        } catch (error) {
            console.log(
                "🚀 ~ file: friends-db.ts ~ line 119 ~ getFriends ~ error",
                error
            );

            return {
                success: false,
                data: undefined,
                error: error + "",
            };
        } finally {
            db.release();
        }
    }
}
