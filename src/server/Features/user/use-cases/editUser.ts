import { IUser } from "../user";
import { IMakeUsersDb } from "../data-access/users-db";
import { handleModerationType } from ".";

type props = {
    usersDb: IMakeUsersDb["returnType"];
    handleModeration: handleModerationType;
};

type returnData = Promise<{
    success: boolean;
    data: IUser | undefined;
    error: string;
}>;

type editUserProps = {
    userId: string;
    updates: Partial<Record<keyof IUser, string>>;
};

export interface IEditUserUseCase {
    editUser: ({ userId, updates }: editUserProps) => Promise<returnData>;
}

export default function makeEditUser({ usersDb, handleModeration }: props) {
    return async function editUser({
        userId,
        updates,
    }: editUserProps): Promise<returnData> {
        if (!userId) {
            throw new Error("An userId must be passed");
        }
        if (Object.values(updates).length <= 0) {
            throw new Error("At least one update must be passed");
        }

        const foundUser = await usersDb.findById({ id: userId });

        if (foundUser.success && foundUser.data === undefined) {
            return foundUser;
        }

        let moderated: number | boolean | null = null;

        if (updates.username) {
            moderated = await handleModeration(updates["username"]);
        }

        if (moderated) {
            return {
                success: false,
                data: undefined,
                error: "Username contains profanity",
            };
        }

        if (moderated === -1) {
            return {
                success: false,
                data: undefined,
                error: "Server Error, please try again.",
            };
        }

        return await usersDb.updateByUserId({ userId, updates });
    };
}
