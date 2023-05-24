import makeFakeChannel from "@/server/__test__/fixures/channel";
import makeDb from "@/server/__test__/fixures/db";
import groupTests from "@/server/__test__/functions/group";
import userTests from "@/server/__test__/functions/user";

import { moderateName } from "../../../Utilities/moderateText";
import makeChannelDb from "../data-access/channel-db";
import { IGroupChannel } from "../groupChannel";
import makeCreateChannel from "../use-cases/createChannel";
import makeDeleteChannel from "../use-cases/deleteChannel";
import makeCreateChannelController from "./create-channel";

describe("Create channel controller", () => {
  visetTimeout(10000);
  // const channelRequest = {
  //     body: {},
  //     headers: {},
  //     ip: "",
  //     method: "",
  //     params: {},
  //     path: "",
  //     query: {},
  // };
  const handleModeration = async (name: string) => {
    return await moderateName(name);
  };

  const channelDb = makeChannelDb({ makeDb });
  const createChannel = makeCreateChannel({ handleModeration, channelDb });
  const createChannelController = makeCreateChannelController({
    createChannel,
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

  test("SUCCESS: create channel", async () => {
    const channelRequest = {
      body: { channelInfo: channel },
      headers: {},
      ip: "",
      method: "POST",
      params: {},
      path: "",
      query: {},
    };

    const createdChannel = await createChannelController(channelRequest);
    expect(createdChannel.body.data?.channelName).toBe(channel.channelName);
  });

  test("Error: channel name not supplied", async () => {
    const channelRequest = {
      body: { channelInfo: { ...channel, channelName: "" } },
      headers: {},
      ip: "",
      method: "POST",
      params: {},
      path: "",
      query: {},
    };

    const createdChannel = await createChannelController(channelRequest);
    expect(createdChannel.body.error).toBe("Channel name needs to be supplied");
  });

  test("Error: group id was not provided", async () => {
    const channelRequest = {
      body: { channelInfo: { ...channel, groupId: "" } },
      headers: {},
      ip: "",
      method: "POST",
      params: {},
      path: "",
      query: {},
    };

    const createdChannel = await createChannelController(channelRequest);
    expect(createdChannel.body.error).toBe("Group Id needs to be supplied");
  });

  test("Error: channel name contains profanity", async () => {
    channel["channelName"] = "bullshit";
    const channelRequest = {
      body: { channelInfo: channel },
      headers: {},
      ip: "",
      method: "POST",
      params: {},
      path: "",
      query: {},
    };

    const createdChannel = await createChannelController(channelRequest);
    expect(createdChannel.body.error).toBe("Channel name contains profanity");
  });
});
