import { IMakeGroupDb } from "../data-access/group-db";
import { IGroup } from "../group";

type props = {
    groupDb: IMakeGroupDb["returnType"];
};

type returnData = Promise<{
    success: boolean;
    data: IGroup | undefined;
    error: string;
}>;

export interface IDeleteGroup {
    deleteGroup: (groupId: string) => Promise<returnData>;
}

export default function makeDeleteGroup({ groupDb }: props) {
    return async function deleteGroup(groupId: string): Promise<returnData> {
        if (!groupId) throw new Error("Group Id needs to be supplied");

        return await groupDb.removeGroup(groupId);
    };
}
