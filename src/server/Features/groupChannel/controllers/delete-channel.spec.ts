import makeFakeChannel from "@/server/__test__/fixures/channel";
import makeDb from "@/server/__test__/fixures/db";
import groupTests from "@/server/__test__/functions/group";
import userTests from "@/server/__test__/functions/user";

import { moderateName } from "../../../Utilities/moderateText";
import makeChannelDb from "../data-access/channel-db";
import { IGroupChannel } from "../groupChannel";
import makeCreateChannel from "../use-cases/createChannel";
import makeDeleteChannel from "../use-cases/deleteChannel";
import makeDeleteChannelController from "./delete-channel";

describe("Delete channel controller", () => {
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

  const deleteChannel = makeDeleteChannel({ channelDb });
  const deleteChannelController = makeDeleteChannelController({
    deleteChannel,
  });

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

  test("SUCCESS: delete channel", async () => {
    const channelRequest = {
      body: { channelId: channel.channelId },
      headers: {},
      ip: "",
      method: "POST",
      params: {},
      path: "",
      query: {},
    };

    await createChannel(channel);

    const deletedChannel = await deleteChannelController(channelRequest);
    expect(deletedChannel.body.data?.channelId).toBe(channel.channelId);
  });

  test("ERROR: channel id does not exist", async () => {
    const channelRequest = {
      body: { channelId: "" },
      headers: {},
      ip: "",
      method: "POST",
      params: {},
      path: "",
      query: {},
    };

    await createChannel(channel);

    const deletedChannel = await deleteChannelController(channelRequest);
    expect(deletedChannel.body.error).toBe("Channel Id needs to be supplied");
  });
});
