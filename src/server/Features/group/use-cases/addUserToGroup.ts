import { user, IMakeGroupDb } from "../data-access/group-db";

type props = {
    groupDb: IMakeGroupDb["returnType"];
};

type returnData = Promise<{
    success: boolean;
    data: user | undefined;
    error: string;
}>;

export interface IAddUserToGroup {
    addUserToGroup: (groupId: string, userId: string) => Promise<returnData>;
}

export default function makeAddUserToGroup({ groupDb }: props) {
    return async function addUserToGroup(
        groupId: string,
        userId: string
    ): Promise<returnData> {
        if (!groupId) throw new Error("Group Id needs to be supplied");
        if (!userId) throw new Error("User Id needs to be supplied");

        return await groupDb.addUserToGroup(groupId, userId, ["2002"]);
    };
}
