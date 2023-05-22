import makeFakeChannel from "@/server/__test__/fixures/channel";
import makeDb from "@/server/__test__/fixures/db";
import groupTests from "@/server/__test__/functions/group";
import userTests from "@/server/__test__/functions/user";

import { IGroupChannel } from "../groupChannel";
import makeDeleteChannel from "../use-cases/deleteChannel";
import makeChannelDb from "./channel-db";

describe("Channel db method tests", () => {
  jest.setTimeout(10000);
  const channelDB = makeChannelDb({ makeDb });

  const deleteGroupChannel = makeDeleteChannel({ channelDb: channelDB });
  let channel: IGroupChannel;

  beforeAll(async () => {
    jest.setTimeout(30000);
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

  test("SUCCESS: create a channel", async () => {
    const res = await channelDB.createChannel(channel);
    if (res.success) expect(res.data?.channelName).toBe(channel.channelName);
  });

  test("SUCCESS: Delete channel", async () => {
    await channelDB.createChannel(channel);

    const deletedChannel = await channelDB.deleteChannel(channel.channelId);
    expect(deletedChannel.data?.channelId).toBe(channel.channelId);
  });

  test("SUCCESS: update channel name", async () => {
    await channelDB.createChannel(channel);

    const updatedChannel = await channelDB.updateChannelName(
      channel.channelId,
      "coders"
    );
    expect(updatedChannel.data?.channelName).toBe("coders");
  });

  test("SUCCESS: get channel by id", async () => {
    await channelDB.createChannel(channel);

    const foundChannel = await channelDB.getChannelById(channel.channelId);
    expect(foundChannel.data?.channelId).toBe(channel.channelId);
  });

  // TODO promise all
  test.skip("SUCCESS: get channels by group id", async () => {
    let channel = await makeFakeChannel({ groupId: "123" });

    await channelDB.createChannel(channel);

    channel = await makeFakeChannel({ groupId: "123" });

    await channelDB.createChannel(channel);

    channel = await makeFakeChannel({ groupId: "123" });

    await channelDB.createChannel(channel);

    channel = await makeFakeChannel({ groupId: "123" });

    await channelDB.createChannel(channel);

    const foundChannels = await channelDB.getChannelsByGroupId(channel.groupId);
    console.log(foundChannels);
    if (foundChannels.data)
      expect(
        foundChannels.data[foundChannels.data.length - 1].channelName
      ).toBe(channel.channelName);
  });
});
