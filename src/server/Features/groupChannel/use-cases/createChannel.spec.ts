import makeFakeChannel from "@/server/__test__/fixures/channel";
import makeDb from "@/server/__test__/fixures/db";
import groupTests from "@/server/__test__/functions/group";
import userTests from "@/server/__test__/functions/user";

import { moderateName } from "../../../Utilities/moderateText";
import makeChannelDb from "../data-access/channel-db";
import { IGroupChannel } from "../groupChannel";
import makeCreateChannel, { handleModerationType } from "./createChannel";
import makeDeleteChannel from "./deleteChannel";

describe("creating channel use case", () => {
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

  test("SUCCESS: created channel", async () => {
    console.log(new Date().toUTCString());
    const createdChannel = await createChannel(channel);

    if (createdChannel.success)
      expect(createdChannel.data?.channelName).toBe(channel.channelName);
  });

  test("ERROR: channel name was not provided", async () => {
    channel["channelName"] = "";
    try {
      await createChannel(channel);
    } catch (err) {
      if (err instanceof Error)
        expect(err.message).toBe("Channel name needs to be supplied");
    }
  });

  test("ERROR: group id was not provided", async () => {
    try {
      await createChannel(channel);
    } catch (err) {
      if (err instanceof Error)
        expect(err.message).toBe("Group Id needs to be supplied");
    }
  });
});
