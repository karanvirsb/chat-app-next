import { ISupertokensDb } from ".";

type props = {
    makeDb: ISupertokensDb["makeDb"];
};

export type user = {
    user_id: string;
    email: string;
    password: string;
    time_joined: number;
};

type returningSupertokenData = Promise<{
    success: boolean;
    data: user | undefined;
    error: string;
}>;

export interface IMakeSupertokensDb {
    returnType: Readonly<{
        addUser: ({ user }: { user: user }) => Promise<returningSupertokenData>;
        deleteUser: ({
            userId,
        }: {
            userId: string;
        }) => Promise<returningSupertokenData>;
    }>;
}

export default function makeSupertokenDb({
    makeDb,
}: props): IMakeSupertokensDb["returnType"] {
    return Object.freeze({
        addUser,
        deleteUser,
    });

    // Find group by id
    async function addUser({
        user,
    }: {
        user: user;
    }): Promise<returningSupertokenData> {
        const db = await makeDb();
        try {
            const query = `INSERT INTO emailpassword_users VALUES('${user.user_id}', '${user.email}', '${user.password}', '${user.time_joined}') RETURNING *;`;
            const res = await db.query(query);

            if (res.rowCount === 1) {
                const user: user = res.rows[0];
                return { success: true, data: user, error: "" };
            } else {
                return {
                    success: true,
                    data: undefined,
                    error: "Could not add user",
                };
            }
        } catch (error) {
            console.log(
                "🚀 ~ file: supertokens-db.ts ~ line 56 ~ addUser ~ error",
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

    async function deleteUser({
        userId,
    }: {
        userId: string;
    }): Promise<returningSupertokenData> {
        const db = await makeDb();
        try {
            const query = `DELETE FROM emailpassword_users WHERE user_id = '${userId}' RETURNING *;`;
            const res = await db.query(query);
            if (res.rowCount === 1) {
                const user: user = res.rows[0];
                return { success: true, data: user, error: "" };
            } else {
                return {
                    success: true,
                    data: undefined,
                    error: "Could not delete user",
                };
            }
        } catch (error) {
            console.log(
                "🚀 ~ file: supertokens-db.ts ~ line 56 ~ deleteUser ~ error",
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
