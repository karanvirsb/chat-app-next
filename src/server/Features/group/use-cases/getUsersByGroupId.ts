import { IMakeGroupDb } from "../data-access/group-db";
import { IGroup } from "../group";

type props = {
    groupDb: IMakeGroupDb["returnType"];
};

export type user = {
    userId: string;
    username: string;
    status: string;
    email: string;
    time_joined: Date;
};

type returnData = Promise<{
    success: boolean;
    data: user[] | undefined;
    error: string;
}>;

export interface IGetUsersByGroupId {
    getUsersByGroupId: (groupId: string) => Promise<returnData>;
}

export default function makeGetUsersByGroupId({ groupDb }: props) {
    return async function getUsersByGroupId(
        groupId: string
    ): Promise<returnData> {
        if (!groupId) throw new Error("Group Id needs to be supplied");

        return await groupDb.findUsersByGroupId(groupId);
    };
}
