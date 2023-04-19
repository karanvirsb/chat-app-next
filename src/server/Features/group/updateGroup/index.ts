import { makeDb } from "../data-access";
import { makeUpdateGroupDBA, makeUpdateGroupUC } from "./updateGroup";

const updateGroupDBA = makeUpdateGroupDBA({ makeDb });
export const updateGroupUC = makeUpdateGroupUC({ updateGroupDBA });
