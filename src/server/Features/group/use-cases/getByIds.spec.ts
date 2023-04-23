import makeDb, { clearDb, closeDb } from "../../../../__test__/fixures/db";
import makeFakeGroup from "../../../../__test__/fixures/group";
import supertokens from "../../../../supertokens";
import makeSupertokenDb from "../../../../supertokens/data-access/supertokens-db";
import { moderateName } from "../../../Utilities/moderateText";
import makeUsersDb from "../../user/data-access/users-db";
import makeGroupDb from "../data-access/group-db";
import { IGroup } from "../group";
import makeAddGroup from "./addGroup";
import makeGetGroupById from "./getGroupbyId";
import makeGetGroupByInviteCode from "./getGroupByInviteCode";
import makeGetUsersByGroupId from "./getUsersByGroupId";

const handleModeration = async (name: string) => {
  return await moderateName(name);
};

describe("Get use cases", () => {
  const groupDb = makeGroupDb({ makeDb });
  const addGroup = makeAddGroup({ groupDb, handleModeration });
  const getGroupById = makeGetGroupById({ groupDb });
  const getGroupByInviteCode = makeGetGroupByInviteCode({ groupDb });
  const getUsersByGroupId = makeGetUsersByGroupId({ groupDb });

  const SupertokensDb = makeSupertokenDb({ makeDb });
  beforeAll(async () => {
    // creating user if it does not exist
    const userDb = makeUsersDb({ makeDb });
    const foundUser = await userDb.findById({
      id: "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc",
    });

    // if user does not exist create
    if (!foundUser.success || !foundUser.data) {
      const addedUser = await SupertokensDb.addUser({
        user: {
          user_id: "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc",
          email: "anTest@gmai.com",
          password: "123",
          time_joined: Date.now(),
        },
      });
      if (addedUser.success && addedUser.data) {
        const addUser = await userDb.insert({
          data: {
            userId: addedUser.data.user_id,
            status: "online",
            username: "testering",
          },
        });
      }
    }
  });

  afterAll(async () => {
    await clearDb("groupt");
    await clearDb('"groupUsers"');
    await SupertokensDb.deleteUser({
      userId: "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc",
    });
    await closeDb();
  });
  test("Get group by id", async () => {
    const group = await makeFakeGroup();
    const addedGroup = await addGroup(
      group,
      "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
    );

    const foundGroup = await getGroupById(group.groupId);

    expect(foundGroup.data?.groupName).toBe(group.groupName);
  });

  test("Get group by id error", async () => {
    const group = await makeFakeGroup();
    const addedGroup = await addGroup(
      group,
      "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
    );
    try {
      const groupErr = await getGroupById("");
    } catch (err) {
      if (err instanceof Error)
        expect(err.message).toBe("Group Id needs to be supplied");
    }
  });

  test("Get group by invite code", async () => {
    const group = await makeFakeGroup();
    const addedGroup = await addGroup(
      group,
      "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
    );

    const foundGroup = await getGroupByInviteCode(group.inviteCode);

    expect(foundGroup.data?.groupName).toBe(group.groupName);
  });

  test("Get group by invite code error", async () => {
    const group = await makeFakeGroup();
    const addedGroup = await addGroup(
      group,
      "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
    );
    try {
      const err = await getGroupByInviteCode("");
    } catch (err) {
      if (err instanceof Error)
        expect(err.message).toBe("Invite code needs to be supplied");
    }
  });

  test("Get group by invite code", async () => {
    const group = await makeFakeGroup();
    const addedGroup = await addGroup(
      group,
      "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
    );

    const foundUsers = await getUsersByGroupId(group.inviteCode);

    if (foundUsers.data)
      expect(foundUsers.data[0].userId).toBe(
        "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
      );
  });

  test("Get group users by id error", async () => {
    const group = await makeFakeGroup();
    const addedGroup = await addGroup(
      group,
      "cc7d98b5-6f88-4ca5-87e2-435d1546f1fc"
    );
    try {
      await getUsersByGroupId("");
    } catch (error) {
      if (error instanceof Error)
        expect(error.message).toBe("Group Id needs to be supplied");
    }
  });
});
