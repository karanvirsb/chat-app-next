import makeFakeChannel from "@/server/__test__/fixures/channel";
import makeDb from "@/server/__test__/fixures/db";
import groupTests from "@/server/__test__/functions/group";
import userTests from "@/server/__test__/functions/user";

import { moderateName } from "../../../Utilities/moderateText";
import makeChannelDb from "../data-access/channel-db";
import { IGroupChannel } from "../groupChannel";
import makeCreateChannel from "../use-cases/createChannel";
import makeDeleteChannel from "../use-cases/deleteChannel";
import makeGetChannelsByGroupId from "../use-cases/getChannelsByGroupId";
import makeGetChannelsByGroupIdController from "./get-channelsByGroupId";

describe("Get channels by group id controller", () => {
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

  const getChannelsByGroupId = makeGetChannelsByGroupId({ channelDb });
  const getChannelsByGroupIdController = makeGetChannelsByGroupIdController({
    getChannelsByGroupId,
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

  test("SUCCESS: get channel by group id", async () => {
    const channelRequest = {
      body: {},
      headers: {},
      ip: "",
      method: "POST",
      params: { groupId: channel.groupId },
      path: "",
      query: {},
    };

    await createChannel(channel);

    const foundChannels = await getChannelsByGroupIdController(channelRequest);
    if (foundChannels.body.data)
      expect(foundChannels.body.data[0].channelId).toBe(channel.channelId);
  });

  test("ERROR: group id does not exist", async () => {
    const channelRequest = {
      body: {},
      headers: {},
      ip: "",
      method: "POST",
      params: { groupId: "" },
      path: "",
      query: {},
    };

    await createChannel(channel);

    const foundChannels = await getChannelsByGroupIdController(channelRequest);
    expect(foundChannels.body.error).toBe("Group Id needs to be supplied");
  });
});
