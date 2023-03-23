export type createGroupUserUCDeps = {
  createGroupDb: ({ gId, uId, lastChecked, roles }: IGroupUser) => Promise<
    | {
        success: boolean;
        data: IGroupUser;
        error: string;
      }
    | {
        success: boolean;
        data: undefined;
        error: string;
      }
  >;
};

export type makeCreateGroupDBAccessProps = {
  makeDb: IGroupUsersDb["makeDb"];
};
