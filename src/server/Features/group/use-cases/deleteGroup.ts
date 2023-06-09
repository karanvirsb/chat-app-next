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
  deleteGroup: (groupId: string) => Promise<UseCaseReturn<IGroup>>;
}

export default function makeDeleteGroup({ groupDb }: props) {
  return async function deleteGroup(
    groupId: string
  ): Promise<UseCaseReturn<IGroup>> {
    if (!groupId)
      return { success: false, error: "Group Id needs to be supplied" };

    return await groupDb.removeGroup(groupId);
  };
}
