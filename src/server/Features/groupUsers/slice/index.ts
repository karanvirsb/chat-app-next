import DBUpdateStr from "../../../Utilities/DBUpdateString";
import { makeDb } from "../data-access";
import {
  makeCreateGroupDBAccess,
  makeCreateGroupUseCase,
} from "./createGroupUser";
import {
  makeDeleteGroupUserController,
  makeDeleteGroupUserDBA,
  makeDeleteGroupUserUC,
} from "./deleteGroupUser";
import { makeGetGroupIdsDBA, makeGetGroupIdsUC } from "./getGroupIds";
import {
  makeUpdateGroupUserController,
  makeUpdateGroupUserDBA,
  makeUpdateGroupUserUC,
} from "./updateGroupUser";

// CREATE GROUP USER
export const createGroupUserDBA = makeCreateGroupDBAccess({ makeDb });
export const createGroupUserUC = makeCreateGroupUseCase({
  createGroupDb: createGroupUserDBA,
});

// DELETE GROUP USER
export const deleteGroupUserDBA = makeDeleteGroupUserDBA({ makeDb });
export const deleteGroupUserUC = makeDeleteGroupUserUC({ deleteGroupUserDBA });
export const deleteGroupUserController = makeDeleteGroupUserController({
  deleteGroupUserUC,
});

// UPDATE GROUP USER
export const updateGroupUserDBA = makeUpdateGroupUserDBA({
  makeDb,
  DBUpdateStr,
});
export const updateGroupUserUC = makeUpdateGroupUserUC({ updateGroupUserDBA });
export const updateGroupUserController = makeUpdateGroupUserController({
  updateGroupUserUC,
});

// GET GROUP IDS
export const getGroupIdsDBA = makeGetGroupIdsDBA({ makeDb });
export const getGroupIdsUC = makeGetGroupIdsUC({ getGroupIdsDBA });
