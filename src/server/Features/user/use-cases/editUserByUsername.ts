import { IUser } from "../user";
import { IMakeUsersDb } from "../data-access/users-db";

type props = {
    usersDb: IMakeUsersDb["returnType"];
};

type returnData = Promise<{
    success: boolean;
    data: IUser | undefined;
    error: string;
}>;

type editUserProps = {
    username: string;
    updates: Partial<Record<keyof IUser, string>>;
};

export default function makeEditUserByUsername({ usersDb }: props) {
    return async function editUser({
        username,
        updates,
    }: editUserProps): returnData {
        if (!username) {
            throw new Error("An username must be passed");
        }
        if (Object.values(updates).length <= 0) {
            throw new Error("At least one update must be passed");
        }

        const foundUser = await usersDb.findByUsername(username);

        if (foundUser.success && foundUser.data === undefined) {
            return foundUser;
        }

        return await usersDb.updateByUsername({ username, updates });
    };
}
