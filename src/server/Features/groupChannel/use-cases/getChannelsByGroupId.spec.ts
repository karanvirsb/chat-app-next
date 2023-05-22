import makeFakeChannel from "@/server/__test__/fixures/channel";
import makeDb from "@/server/__test__/fixures/db";
import groupTests from "@/server/__test__/functions/group";
import userTests from "@/server/__test__/functions/user";

import { moderateName } from "../../../Utilities/moderateText";
import makeChannelDb from "../data-access/channel-db";
import { IGroupChannel } from "../groupChannel";
import makeCreateChannel, { handleModerationType } from "./createChannel";
import makeDeleteChannel from "./deleteChannel";
import makeGetChannelsByGroupId from "./getChannelsByGroupId";

describe("get channels by group id use case", () => {
  const handleModeration: handleModerationType = async (
    channelName: string
  ) => {
    return await moderateName(channelName);
  };
  const channelDb = makeChannelDb({ makeDb });
  const createChannel = makeCreateChannel({
    handleModeration,
    channelDb,
  });
  const getChannelsByGroupId = makeGetChannelsByGroupId({
    channelDb,
  });

  const deleteGroupChannel = makeDeleteChannel({ channelDb });
  let channel: IGroupChannel;

  beforeAll(async () => {
    visetTimeout(30000);
    await userTests.addTestUserToDB({ userId: "123" });
    await groupTests.createTestGroup({
      groupId: "123",
      userId: "123",
    });
  });

  beforeEach(async () => {
    channel = await makeFakeChannel({ groupId: "123" });
  });

  afterEach(async () => {
    await deleteGroupChannel(channel.channelId);
  });

  afterAll(async () => {
    await userTests.deleteTestUser({
      userId: "123",
    });
    await groupTests.deleteTestGroup({
      groupId: "123",
      userId: "123",
    });
  });

  test("SUCCESS: get channels by group id", async () => {
    await createChannel(channel);

    const foundChannel = await getChannelsByGroupId(channel.groupId);
    if (foundChannel.data)
      expect(foundChannel.data[0].channelName).toBe(channel.channelName);
  });

  test("ERROR: group id does not exist", async () => {
    await createChannel(channel);

    try {
      await getChannelsByGroupId("");
    } catch (error) {
      if (error instanceof Error)
        expect(error.message).toBe("Group Id needs to be supplied");
    }
  });
});
