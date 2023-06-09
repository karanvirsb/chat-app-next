import { IGroupUser } from "@/server/Features/groupUsers/groupUsers";
import { makeCreateGroupDBAccess } from "@/server/Features/groupUsers/slice/createGroupUser";
import { makeDeleteGroupUserDBA } from "@/server/Features/groupUsers/slice/deleteGroupUser";

import makeDb from "../fixures/db";

const groupUserTests = Object.freeze({
  createGroupUserTest,
  deleteGroupUserTest,
});

export default groupUserTests;

async function createGroupUserTest({
  groupId,
  userId,
}: {
  groupId: string;
  userId: string;
}) {
  const groupUserDb = makeCreateGroupDBAccess({ makeDb });
  const groupUser: IGroupUser = {
    gId: groupId,
    uId: userId,
    roles: ["2000"],
    lastChecked: new Date(),
  };

  const addedGroupUser = await groupUserDb(groupUser);

  return addedGroupUser;
}

async function deleteGroupUserTest({
  groupId,
  userId,
}: {
  groupId: string;
  userId: string;
}) {
  const deleteGroupUserDBA = makeDeleteGroupUserDBA({ makeDb });
  const deletedGroup = await deleteGroupUserDBA({ groupId, userId });

  return deletedGroup;
}
