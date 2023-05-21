import { faker } from "@faker-js/faker";

import makeUsersDb from "@/server/Features/user/data-access/users-db";

import makeDb from "../fixures/db";

const userTests = Object.freeze({
  addTestUserToDB,
  deleteTestUser,
});
export default userTests;

async function addTestUserToDB({
  userId,
}: {
  userId: string;
}): Promise<boolean> {
  // creating user if it does not exist
  const userDb = makeUsersDb({ makeDb });

  // if user does not exist create
  const addedUser = await userDb.insert({
    data: {
      userId: userId,
      status: "online",
      username: `${faker.name.firstName()}-${faker.name.lastName()}`,
      password: "123",
    },
  });

  return addedUser?.success;
}

async function deleteTestUser({
  userId,
}: {
  userId: string;
}): Promise<boolean> {
  const userDb = makeUsersDb({ makeDb });
  const deletedUser = await userDb.remove(userId);
  return deletedUser.success;
}
