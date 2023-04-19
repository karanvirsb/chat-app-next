import { makeDb } from "../data-access";
import {
  makeUpdateGroupMessageDBA,
  makeUpdateGroupMessageUC,
} from "./updateMessage";

const updateGroupMessageDBA = makeUpdateGroupMessageDBA({ makeDb });
export const updateGroupMessageUC = makeUpdateGroupMessageUC({
  updateGroupMessageDBA,
});
