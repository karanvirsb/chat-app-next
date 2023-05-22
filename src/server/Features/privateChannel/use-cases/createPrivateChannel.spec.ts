import makeDb from "@/server/__test__/fixures/db";
import makeFakePrivateChannel from "@/server/__test__/fixures/privateChannel";
import userTests from "@/server/__test__/functions/user";

import { moderateName } from "../../../Utilities/moderateText";
import makePrivateChannelDb from "../data-access/privateChannel-db";
import { IPrivateChannel } from "../privateChannel";
import makeCreatePrivateChannel, {
  handleModerationType,
} from "./createPrivateChannel";
import makeDeletePrivateChannel from "./deletePrivateChannel";

describe("creating private channel use case", () => {
  const handleModeration: handleModerationType = async (
    channelName: string
  ) => {
    return await moderateName(channelName);
  };
  const privateChannelDb = makePrivateChannelDb({ makeDb });
  const createPrivateChannel = makeCreatePrivateChannel({
    handleModeration,
    privateChannelDb,
  });

  const deletePrivateChannel = makeDeletePrivateChannel({ privateChannelDb });
  let channel: IPrivateChannel;

  beforeAll(async () => {
    jest.setTimeout(30000);
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

  test("SUCCESS: created private channel", async () => {
    const createdChannel = await createPrivateChannel(channel);

    expect(createdChannel.data?.channelName).toBe(channel.channelName);
  });

  test("ERROR: channel name was not provided", async () => {
    channel["channelName"] = "";
    try {
      await createPrivateChannel(channel);
    } catch (err) {
      if (err instanceof Error)
        expect(err.message).toBe(
          "Channel name should contain valid characters"
        );
    }
  });

  test("ERROR: user id was not provided", async () => {
    channel["userId"] = "";

    try {
      await createPrivateChannel(channel);
    } catch (err) {
      if (err instanceof Error)
        expect(err.message).toBe("User Id needs to be supplied");
    }
  });

  test("ERROR: friends id was not provided", async () => {
    channel["friendsId"] = "";

    try {
      await createPrivateChannel(channel);
    } catch (err) {
      if (err instanceof Error)
        expect(err.message).toBe("Friends Id needs to be supplied");
    }
  });
});
