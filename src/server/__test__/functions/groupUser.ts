import makeDb from "../fixures/db";
import { IGroupUser } from "../../src/Features/groupUsers/groupUsers";
import { makeCreateGroupDBAccess } from "../../src/Features/groupUsers/slice/createGroupUser";
import { makeDeleteGroupUserDBA } from "../../src/Features/groupUsers/slice/deleteGroupUser";

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
  let groupUserDb = makeCreateGroupDBAccess({ makeDb });
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
