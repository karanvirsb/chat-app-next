import makeFakeChannel from "@/server/__test__/fixures/channel";
import makeDb from "@/server/__test__/fixures/db";
import groupTests from "@/server/__test__/functions/group";
import userTests from "@/server/__test__/functions/user";

import { moderateName } from "../../../Utilities/moderateText";
import makeChannelDb from "../data-access/channel-db";
import { IGroupChannel } from "../groupChannel";
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
    await deleteChannel(channel.channelId);
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

  test("SUCCESS: deleting channel", async () => {
    await createChannel(channel);

    const deletedChannel = await deleteChannel(channel.channelId);
    expect(deletedChannel.data?.channelId).toBe(channel.channelId);
  });

  test("ERROR: channel id not provided", async () => {
    await createChannel(channel);

    try {
      await deleteChannel("");
    } catch (error) {
      if (error instanceof Error)
        expect(error.message).toBe("Channel Id needs to be supplied");
    }
  });
});
