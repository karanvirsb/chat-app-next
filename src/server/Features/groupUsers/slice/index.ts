import {
  makeCreateGroupDBAccess,
  makeCreateGroupUseCase,
} from "./createGroupUser";
import { makeDb } from "../data-access";
import {
  makeDeleteGroupUserController,
  makeDeleteGroupUserDBA,
  makeDeleteGroupUserUC,
} from "./deleteGroupUser";
import {
  makeUpdateGroupUserController,
  makeUpdateGroupUserDBA,
  makeUpdateGroupUserUC,
} from "./updateGroupUser";
import DBUpdateStr from "../../../Utilities/DBUpdateString";

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
