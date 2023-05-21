import makeDb, { clearDb } from "@/server/__test__/fixures/db";
import makeFakePrivateChannel from "@/server/__test__/fixures/privateChannel";
import userTests from "@/server/__test__/functions/user";

import { moderateName } from "../../../Utilities/moderateText";
import makePrivateChannelDb from "../data-access/privateChannel-db";
import makeCreatePrivateChannel from "../use-cases/createPrivateChannel";
import makeUpdateLastActive from "../use-cases/updateLastActive";
import makeCreatePrivateChannelController from "./create-privateChannel";
import makeUpdateLastActiveController from "./update-lastActive";

describe("Create private channel controller", () => {
  jest.setTimeout(10000);
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

  const updateLastActive = makeUpdateLastActive({ privateChannelDb });
  const updateLastActiveController = makeUpdateLastActiveController({
    updateLastActive,
  });
  beforeAll(async () => {
    jest.setTimeout(30000);
    const addedUser = await userTests.addTestUserToDB({
      userId: "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
    });
    const secondUser = await userTests.addTestUserToDB({
      userId: "312c0878-04c3-4585-835e-c66900ccc7a1",
    });
  });

  afterAll(async () => {
    jest.setTimeout(30000);
    // TODO await clearDb("private_channels");
    const deletedUser = await userTests.deleteTestUser({
      userId: "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
    });
    const deletedSecondUser = await userTests.deleteTestUser({
      userId: "312c0878-04c3-4585-835e-c66900ccc7a1",
    });
  });
  test("SUCCESS: create channel", async () => {
    const channel = await makeFakePrivateChannel(
      "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
      "312c0878-04c3-4585-835e-c66900ccc7a1"
    );

    const channelRequest = {
      body: { channelId: channel.channelId, newDate: new Date() },
      headers: {},
      ip: "",
      method: "POST",
      params: {},
      path: "",
      query: {},
    };

    const createdChannel = await createPrivateChannel(channel);

    const updatedChannel = await updateLastActiveController(channelRequest);

    expect(updatedChannel.body.data?.channelName).not.toBe(channel.lastActive);
  });

  test("Error: private channel name not supplied", async () => {
    const channel = await makeFakePrivateChannel(
      "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
      "312c0878-04c3-4585-835e-c66900ccc7a1"
    );

    const channelRequest = {
      body: { channelId: "", newDate: new Date() },
      headers: {},
      ip: "",
      method: "POST",
      params: {},
      path: "",
      query: {},
    };

    const createdChannel = await createPrivateChannel(channel);

    const updatedChannel = await updateLastActiveController(channelRequest);

    expect(updatedChannel.body.error).toBe("Channel Id needs to be supplied.");
  });
});
