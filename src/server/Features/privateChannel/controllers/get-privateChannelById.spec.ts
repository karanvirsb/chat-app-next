import makeDb from "@/server/__test__/fixures/db";
import makeFakePrivateChannel from "@/server/__test__/fixures/privateChannel";
import userTests from "@/server/__test__/functions/user";

import { moderateName } from "../../../Utilities/moderateText";
import makePrivateChannelDb from "../data-access/privateChannel-db";
import { IPrivateChannel } from "../privateChannel";
import makeCreatePrivateChannel from "../use-cases/createPrivateChannel";
import makeDeletePrivateChannel from "../use-cases/deletePrivateChannel";
import makeGetPrivateChannelById from "../use-cases/getPrivateChannelById";
import makeGetPrivateChannelByIdController from "./get-privateChannelById";

describe("Get private channel by id controller", () => {
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
  const createChannel = makeCreatePrivateChannel({
    handleModeration,
    privateChannelDb,
  });

  const getPrivateChannelById = makeGetPrivateChannelById({
    privateChannelDb,
  });
  const getPrivateChannelByIdController = makeGetPrivateChannelByIdController({
    getPrivateChannelById,
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

  test("SUCCESS: get channel by id", async () => {
    const channelRequest = {
      body: {},
      headers: {},
      ip: "",
      method: "POST",
      params: { channelId: channel.channelId },
      path: "",
      query: {},
    };

    await createChannel(channel);

    const foundChannel = await getPrivateChannelByIdController(channelRequest);
    expect(foundChannel.body.data?.channelId).toBe(channel.channelId);
  });

  test("ERROR: channel id does not exist", async () => {
    const channelRequest = {
      body: {},
      headers: {},
      ip: "",
      method: "POST",
      params: { channelId: "" },
      path: "",
      query: {},
    };

    await createChannel(channel);

    const foundChannel = await getPrivateChannelByIdController(channelRequest);
    expect(foundChannel.body.error).toBe("Channel Id needs to be supplied");
  });
});
