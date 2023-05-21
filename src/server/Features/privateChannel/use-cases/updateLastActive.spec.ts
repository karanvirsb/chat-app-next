import makeDb, { clearDb } from "@/server/__test__/fixures/db";
import makeFakePrivateChannel from "@/server/__test__/fixures/privateChannel";
import userTests from "@/server/__test__/functions/user";

import { moderateName } from "../../../Utilities/moderateText";
import makePrivateChannelDb from "../data-access/privateChannel-db";
import makeCreatePrivateChannel, {
  handleModerationType,
} from "./createPrivateChannel";
import makeUpdateLastActive from "./updateLastActive";

describe("update private channels last active date use case", () => {
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
  const updateLastActive = makeUpdateLastActive({
    privateChannelDb,
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
    // TODO await clearDb("private_channels");
    const deletedUser = await userTests.deleteTestUser({
      userId: "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
    });
    const deletedSecondUser = await userTests.deleteTestUser({
      userId: "312c0878-04c3-4585-835e-c66900ccc7a1",
    });
  });

  test("SUCCESS: get private channels by group id", async () => {
    const channel = await makeFakePrivateChannel(
      "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
      "312c0878-04c3-4585-835e-c66900ccc7a1"
    );

    const createdChannel = await createPrivateChannel(channel);

    const foundChannel = await updateLastActive(channel.channelId, new Date());

    expect(foundChannel.data?.lastActive).not.toBe(channel.lastActive);
  });

  test("ERROR: channel id does not exist", async () => {
    const channel = await makeFakePrivateChannel(
      "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
      "312c0878-04c3-4585-835e-c66900ccc7a1"
    );

    const createdChannel = await createPrivateChannel(channel);

    try {
      const foundChannel = await updateLastActive("", new Date());
    } catch (error) {
      if (error instanceof Error)
        expect(error.message).toBe("Channel Id needs to be supplied.");
    }
  });
});
