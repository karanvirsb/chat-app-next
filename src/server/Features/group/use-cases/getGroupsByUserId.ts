import { IMakeGroupDb } from "../data-access/group-db";
import { IGroup } from "../group";

type props = {
    groupDb: IMakeGroupDb["returnType"];
};

type returnData = Promise<{
    success: boolean;
    data: IGroup[] | undefined;
    error: string;
}>;

export interface IGetGroupsByUserId {
    getGroupsByUserId: (groupId: string) => returnData;
}

export default function makeGetGroupsByUserId({ groupDb }: props) {
    return async function getGroupsByUserId(userId: string): returnData {
        if (!userId) throw new Error("User Id needs to be supplied.");

        return await groupDb.findGroupsByUserId(userId);
    };
}
