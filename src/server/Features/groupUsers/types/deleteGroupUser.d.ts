import { IGroupUsersDb } from "../data-access";
import { httpResponseType } from "../../../express-callback";

type deleteGroupUserProps = {
  groupId: string;
  userId: string;
};

export type deleteGroupUserReturn = ({
  groupId,
  userId,
}: deleteGroupUserProps) => Promise<{
  success: boolean;
  data: IGroupUser | undefined;
  error: string;
}>;

export type makeDeleteGroupUserControllerDep = {
  deleteGroupUserUC: deleteGroupUserReturn;
};

export interface IDeleteGroupUserC extends httpResponseType {
  body: {
    success: boolean;
    data: IGroupUser | undefined;
    error: string;
  };
}

export type deleteGroupUserUCDependency = {
  deleteGroupUserDBA: deleteGroupUserReturn;
};

export type deleteGroupUserDBAProps = {
  makeDb: IGroupUsersDb["makeDb"];
};
