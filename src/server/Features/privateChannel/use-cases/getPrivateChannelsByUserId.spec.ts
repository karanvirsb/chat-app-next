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
import makeGetPrivateChannelsByUserId from "./getPrivateChannelsByUserId";

describe("get private channels by user id use case", () => {
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
  const getPrivateChannelsByUserId = makeGetPrivateChannelsByUserId({
    privateChannelDb,
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

  test("SUCCESS: get private channels by group id", async () => {
    createPrivateChannel(channel);

    const foundChannel = await getPrivateChannelsByUserId(channel.userId);
    if (foundChannel.data)
      expect(foundChannel.data[0].channelName).toBe(channel.channelName);
  });

  test("ERROR: user id does not exist", async () => {
    await createPrivateChannel(channel);

    try {
      await getPrivateChannelsByUserId("");
    } catch (error) {
      if (error instanceof Error)
        expect(error.message).toBe("User Id needs to be supplied");
    }
  });
});
