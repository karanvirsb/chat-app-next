import { groupUsers, IMakeGroupDb } from "../data-access/group-db";

type props = {
    groupDb: IMakeGroupDb["returnType"];
};

type returnData = Promise<{
    success: boolean;
    data: groupUsers | undefined;
    error: string;
}>;

export interface IRemoveUserFromGroup {
    removeUserFromGroup: (
        groupId: string,
        userId: string
    ) => Promise<returnData>;
}

export default function makeRemoveUserFromGroup({ groupDb }: props) {
    return async function removeUserFromGroup(
        groupId: string,
        userId: string
    ): Promise<returnData> {
        if (!groupId || groupId.length === 0)
            throw new Error("Group Id needs to be supplied");
        if (!userId || userId.length === 0)
            throw new Error("User Id needs to be supplied");

        return await groupDb.removeUserFromGroup(groupId, userId);
    };
}
