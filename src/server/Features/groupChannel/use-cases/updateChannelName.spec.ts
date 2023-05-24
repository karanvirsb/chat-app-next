import makeFakeChannel from "@/server/__test__/fixures/channel";
import makeDb from "@/server/__test__/fixures/db";
import groupTests from "@/server/__test__/functions/group";
import userTests from "@/server/__test__/functions/user";

import { moderateName } from "../../../Utilities/moderateText";
import makeChannelDb from "../data-access/channel-db";
import { IGroupChannel } from "../groupChannel";
import makeCreateChannel, { handleModerationType } from "./createChannel";
import makeDeleteChannel from "./deleteChannel";
import makeUpdateChannelName from "./updateChannelName";

describe("updating channel name use case", () => {
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
  const updateChannelName = makeUpdateChannelName({
    handleModeration,
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

  test("SUCCESS: updating channel name", async () => {
    await createChannel(channel);

    const updatedChannel = await updateChannelName(channel.channelId, "coders");

    expect(updatedChannel.data?.channelName).toBe("coders");
  });

  test("ERROR: channelId does not exist", async () => {
    await createChannel(channel);

    try {
      await updateChannelName("", "coders");
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toBe("Channel Id needs to be supplied");
      }
    }
  });

  test("ERROR: new name does not exist", async () => {
    await createChannel(channel);

    try {
      await updateChannelName("123", "");
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toBe("New Channel Name needs to be supplied");
      }
    }
  });

  test("ERROR: new name contains profanity", async () => {
    await createChannel(channel);

    try {
      await updateChannelName("123", "bullshit");
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toBe("New Channel Name contains profanity");
      }
    }
  });
});
