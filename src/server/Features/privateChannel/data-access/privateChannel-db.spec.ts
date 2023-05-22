import makeDb from "@/server/__test__/fixures/db";
import makeFakePrivateChannel from "@/server/__test__/fixures/privateChannel";
import userTests from "@/server/__test__/functions/user";

import { IPrivateChannel } from "../privateChannel";
import makePrivateChannelDb from "./privateChannel-db";

describe("Private Channel db method tests", () => {
  visetTimeout(10000);
  const privateChannelDB = makePrivateChannelDb({ makeDb });

  let channel: IPrivateChannel;

  beforeAll(async () => {
    visetTimeout(30000);
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
    await privateChannelDB.deletePrivateChannel(channel.channelId);
  });

  afterAll(async () => {
    await userTests.deleteTestUser({
      userId: "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
    });
    await userTests.deleteTestUser({
      userId: "312c0878-04c3-4585-835e-c66900ccc7a1",
    });
  });
  test("SUCCESS: create a private channel", async () => {
    const res = await privateChannelDB.createPrivateChannel(channel);
    console.log(res);

    expect(res.data?.channelName).toBe(channel.channelName);
  });

  test("SUCCESS: Delete channel", async () => {
    await privateChannelDB.createPrivateChannel(channel);

    const deletedChannel = await privateChannelDB.deletePrivateChannel(
      channel.channelId
    );
    expect(deletedChannel.data?.channelId).toBe(channel.channelId);
  });

  test("SUCCESS: get private channel by id", async () => {
    await privateChannelDB.createPrivateChannel(channel);

    const foundChannel = await privateChannelDB.getPrivateChannelById(
      channel.channelId
    );
    expect(foundChannel.data?.channelId).toBe(channel.channelId);
  });
  // TODO Promise all
  test.skip("SUCCESS: get private channels by user id", async () => {
    let channel = await makeFakePrivateChannel(
      "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
      "312c0878-04c3-4585-835e-c66900ccc7a1"
    );

    await privateChannelDB.createPrivateChannel(channel);

    channel = await makeFakePrivateChannel(
      "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
      "312c0878-04c3-4585-835e-c66900ccc7a1"
    );

    await privateChannelDB.createPrivateChannel(channel);

    channel = await makeFakePrivateChannel(
      "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
      "312c0878-04c3-4585-835e-c66900ccc7a1"
    );

    await privateChannelDB.createPrivateChannel(channel);

    channel = await makeFakePrivateChannel(
      "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
      "312c0878-04c3-4585-835e-c66900ccc7a1"
    );
    await privateChannelDB.createPrivateChannel(channel);

    const foundChannels = await privateChannelDB.getPrivateChannelsByUserId(
      channel.userId
    );
    console.log(foundChannels);
    if (foundChannels.data)
      expect(
        foundChannels.data[foundChannels.data.length - 1].channelName
      ).toBe(channel.channelName);
  });
});
