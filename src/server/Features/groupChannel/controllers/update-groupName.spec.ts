import makeFakeChannel from "@/server/__test__/fixures/channel";
import makeDb from "@/server/__test__/fixures/db";
import groupTests from "@/server/__test__/functions/group";
import userTests from "@/server/__test__/functions/user";

import { moderateName } from "../../../Utilities/moderateText";
import makeChannelDb from "../data-access/channel-db";
import { IGroupChannel } from "../groupChannel";
import makeCreateChannel from "../use-cases/createChannel";
import makeDeleteChannel from "../use-cases/deleteChannel";
import makeUpdateChannelName from "../use-cases/updateChannelName";
import makeUpdateChannelNameController from "./update-groupName";

describe("Update group name controller", () => {
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

  const updateChannelName = makeUpdateChannelName({
    handleModeration,
    channelDb,
  });
  const updateChannelNameController = makeUpdateChannelNameController({
    updateChannelName,
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
    const channelRequest = {
      body: { channelId: channel.channelId, newName: "coders" },
      headers: {},
      ip: "",
      method: "POST",
      params: {},
      path: "",
      query: {},
    };

    await createChannel(channel);

    const updatedChannel = await updateChannelNameController(channelRequest);

    expect(updatedChannel.body.data?.channelName).toBe("coders");
  });

  test("ERROR: channel id does not exist", async () => {
    const channelRequest = {
      body: { channelId: "", newName: "coders" },
      headers: {},
      ip: "",
      method: "POST",
      params: {},
      path: "",
      query: {},
    };

    await createChannel(channel);

    const updatedChannel = await updateChannelNameController(channelRequest);
    expect(updatedChannel.body.error).toBe("Channel Id needs to be supplied");
  });

  test("ERROR: new name does not exist", async () => {
    const channelRequest = {
      body: { channelId: channel.channelId, newName: "" },
      headers: {},
      ip: "",
      method: "POST",
      params: {},
      path: "",
      query: {},
    };

    await createChannel(channel);

    const updatedChannel = await updateChannelNameController(channelRequest);
    expect(updatedChannel.body.error).toBe(
      "New Channel Name needs to be supplied"
    );
  });

  test("ERROR: new name contains profanity", async () => {
    const channelRequest = {
      body: { channelId: channel.channelId, newName: "bullshit" },
      headers: {},
      ip: "",
      method: "POST",
      params: {},
      path: "",
      query: {},
    };

    await createChannel(channel);

    const updatedChannel = await updateChannelNameController(channelRequest);
    expect(updatedChannel.body.error).toBe(
      "New Channel Name contains profanity"
    );
  });
});
