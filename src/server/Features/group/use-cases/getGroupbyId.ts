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

export interface IGetGroupById {
    getGroupById: (groupId: string) => Promise<returnData>;
}

export default function makeGetGroupById({ groupDb }: props) {
    return async function getGroupById(groupId: string): Promise<returnData> {
        if (!groupId) throw new Error("Group Id needs to be supplied");

        return await groupDb.findById(groupId);
    };
}
