import makeFakeChannel from "@/server/__test__/fixures/channel";
import makeDb from "@/server/__test__/fixures/db";
import groupTests from "@/server/__test__/functions/group";
import userTests from "@/server/__test__/functions/user";

import { moderateName } from "../../../Utilities/moderateText";
import makeChannelDb from "../data-access/channel-db";
import { IGroupChannel } from "../groupChannel";
import makeCreateChannel, { handleModerationType } from "./createChannel";
import makeDeleteChannel from "./deleteChannel";
import makeGetChannelById from "./getChannelById";

describe("get channel by id use case", () => {
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
  const getChannelById = makeGetChannelById({
    channelDb,
  });

  const deleteGroupChannel = makeDeleteChannel({ channelDb });
  let channel: IGroupChannel;

  beforeAll(async () => {
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

  test("SUCCESS: get channel by id", async () => {
    await createChannel(channel);

    const foundChannel = await getChannelById(channel.channelId);
    expect(foundChannel.data?.channelName).toBe(channel.channelName);
  });

  test("ERROR: channel id does not exist", async () => {
    await createChannel(channel);

    try {
      await getChannelById("");
    } catch (error) {
      if (error instanceof Error)
        expect(error.message).toBe("Channel Id needs to be supplied");
    }
  });
});
