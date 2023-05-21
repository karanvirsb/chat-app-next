import { faker } from "@faker-js/faker";
import cuid from "cuid";

import makeGroupDb from "@/server/Features/group/data-access/group-db";
import { deleteGroupUserUC } from "@/server/Features/groupUsers/slice";

import makeDb from "../fixures/db";

const groupTests = Object.freeze({ createTestGroup, deleteTestGroup });

export default groupTests;

async function createTestGroup({
  groupId,
  userId,
}: {
  groupId: string;
  userId: string;
}) {
  const groupDb = makeGroupDb({ makeDb });
  const group = {
    groupId,
    groupName: faker.company.bsNoun(),
    inviteCode: cuid.slug(),
    dateCreated: new Date(),
  };

  const addedGroup = await groupDb.createGroup(group, userId);

  return addedGroup;
}

async function deleteTestGroup({
  groupId,
  userId,
}: {
  groupId: string;
  userId: string;
}) {
  const groupDb = makeGroupDb({ makeDb });
  const deletedGroup = await groupDb.removeGroup(groupId);
  const removedUser = await deleteGroupUserUC({ groupId, userId });
  return deletedGroup && removedUser.success;
}
