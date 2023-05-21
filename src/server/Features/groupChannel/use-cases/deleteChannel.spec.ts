import makeFakeChannel from "@/server/__test__/fixures/channel";
import makeDb, { clearDb } from "@/server/__test__/fixures/db";
import groupTests from "@/server/__test__/functions/group";
import userTests from "@/server/__test__/functions/user";

import { moderateName } from "../../../Utilities/moderateText";
import makeChannelDb from "../data-access/channel-db";
import makeCreateChannel, { handleModerationType } from "./createChannel";
import makeDeleteChannel from "./deleteChannel";

describe("deleting channel use case", () => {
  const handleModeration: handleModerationType = async (
    channelName: string
  ) => {
    return await moderateName(channelName);
  };

  const channelDb = makeChannelDb({ makeDb });
  const deleteChannel = makeDeleteChannel({
    channelDb,
  });
  const createChannel = makeCreateChannel({
    handleModeration,
    channelDb,
  });

  beforeAll(async () => {
    jest.setTimeout(30000);
    const addedUser = await userTests.addTestUserToDB({ userId: "123" });
    const addedGroup = await groupTests.createTestGroup({
      groupId: "123",
      userId: "123",
    });
  });

  afterAll(async () => {
    // TODO await clearDb("group_channels");
    const deletedUser = await userTests.deleteTestUser({ userId: "123" });
    const deletedGroup = await groupTests.deleteTestGroup({
      groupId: "123",
      userId: "123",
    });
  });

  test("SUCCESS: deleting channel", async () => {
    const channel = await makeFakeChannel();
    channel.groupId = "123";
    const addedChannel = await createChannel(channel);

    const deletedChannel = await deleteChannel(channel.channelId);
    expect(deletedChannel.data?.channelId).toBe(channel.channelId);
  });

  test("ERROR: channel id not provided", async () => {
    const channel = await makeFakeChannel();
    channel.groupId = "123";
    const addedChannel = await createChannel(channel);

    try {
      const deletedChannel = await deleteChannel("");
    } catch (error) {
      if (error instanceof Error)
        expect(error.message).toBe("Channel Id needs to be supplied");
    }
  });
});
