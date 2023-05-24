import makeDb from "@/server/__test__/fixures/db";
import makeFakePrivateChannel from "@/server/__test__/fixures/privateChannel";
import userTests from "@/server/__test__/functions/user";

import { moderateName } from "../../../Utilities/moderateText";
import makePrivateChannelDb from "../data-access/privateChannel-db";
import { IPrivateChannel } from "../privateChannel";
import makeCreatePrivateChannel from "../use-cases/createPrivateChannel";
import makeDeletePrivateChannel from "../use-cases/deletePrivateChannel";
import makeCreatePrivateChannelController from "./create-privateChannel";

describe("Create private channel controller", () => {
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

  const privateChannelDb = makePrivateChannelDb({ makeDb });
  const createPrivateChannel = makeCreatePrivateChannel({
    handleModeration,
    privateChannelDb,
  });
  const createPrivateChannelController = makeCreatePrivateChannelController({
    createPrivateChannel,
  });

  const deletePrivateChannel = makeDeletePrivateChannel({ privateChannelDb });
  let channel: IPrivateChannel;

  beforeAll(async () => {
    await userTests.addTestUserToDB({
      userId: "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
    });
    await userTests.addTestUserToDB({
      userId: "312c0878-04c3-4585-835e-c66900ccc7a1",
    });
  });

  beforeEach(async () => {
    channel = await makeFakePrivateChannel(
      "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
      "312c0878-04c3-4585-835e-c66900ccc7a1"
    );
  });

  afterEach(async () => {
    await deletePrivateChannel(channel.channelId);
  });

  afterAll(async () => {
    await userTests.deleteTestUser({
      userId: "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
    });
    await userTests.deleteTestUser({
      userId: "312c0878-04c3-4585-835e-c66900ccc7a1",
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

    const createdChannel = await createPrivateChannelController(channelRequest);
    expect(createdChannel.body.data?.channelName).toBe(channel.channelName);
  });

  test("Error: private channel name not supplied", async () => {
    const channelRequest = {
      body: { channelInfo: { ...channel, channelName: "" } },
      headers: {},
      ip: "",
      method: "POST",
      params: {},
      path: "",
      query: {},
    };

    const createdChannel = await createPrivateChannelController(channelRequest);
    expect(createdChannel.body.error).toBe(
      "Channel name should contain valid characters"
    );
  });

  test("Error: user id was not provided", async () => {
    const channelRequest = {
      body: { channelInfo: { ...channel, userId: "" } },
      headers: {},
      ip: "",
      method: "POST",
      params: {},
      path: "",
      query: {},
    };

    const createdChannel = await createPrivateChannelController(channelRequest);
    expect(createdChannel.body.error).toBe("User Id needs to be supplied");
  });

  test("Error: private channel name contains profanity", async () => {
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

    const createdChannel = await createPrivateChannelController(channelRequest);
    expect(createdChannel.body.error).toBe("Channel name contains profanity");
  });
});
