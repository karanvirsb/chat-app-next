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

export interface IDeleteUserUserCase {
    deleteUser: (userId: string) => Promise<returnData>;
}

export default function makeDeleteUser({ usersDb }: props) {
    return async function deleteUser(userId: string): Promise<returnData> {
        if (!userId) {
            throw new Error("An userId must be passed");
        }

        const foundUser = await usersDb.findById({ id: userId });

        if (foundUser.success && foundUser.data === undefined) {
            return foundUser;
        }

        return await usersDb.remove(userId);
    };
}
