import makeDb, { clearDb } from "@/server/__test__/fixures/db";
import makeFakePrivateMessage from "@/server/__test__/fixures/privateMessage";
import privateChannelTests from "@/server/__test__/functions/privateChannel";
import userTests from "@/server/__test__/functions/user";

import makePrivateChannelDb from "../../privateChannel/data-access/privateChannel-db";
import makePrivateMessageDb from "../data-access/privateMessage-db";
import makeCreatePrivateMessage from "./createPrivateMessage";
import makeGetPrivateMessagesByChannelId from "./getPrivateMessagesByChannelId";

describe("Getting private messages by channel id use case", () => {
  const privateMessageDb = makePrivateMessageDb({ makeDb });
  const createMessage = makeCreatePrivateMessage({ privateMessageDb });
  const getMessagesByChannelId = makeGetPrivateMessagesByChannelId({
    privateMessageDb,
  });

  jest.setTimeout(30000);
  beforeAll(async () => {
    const addedUser = await userTests.addTestUserToDB({
      userId: "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
    });
    const secondUser = await userTests.addTestUserToDB({
      userId: "312c0878-04c3-4585-835e-c66900ccc7a1",
    });
    const privateChannel = await privateChannelTests.createTestPrivateChannel({
      userId: "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
      friendsId: "312c0878-04c3-4585-835e-c66900ccc7a1",
      channelId: "123",
    });
  });

  afterAll(async () => {
    // TODO await clearDb("private_messages");
    const deletedPrivateChannel =
      await privateChannelTests.deleteTestPrivateChannel({
        channelId: "123",
      });
    const deletedUser = await userTests.deleteTestUser({
      userId: "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
    });
    const deletedSecondUser = await userTests.deleteTestUser({
      userId: "312c0878-04c3-4585-835e-c66900ccc7a1",
    });
  });

  test("SUCCESS: getting a message", async () => {
    jest.setTimeout(15000);
    const message = await makeFakePrivateMessage(
      "123",
      "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
    );
    const insertedMessage = await createMessage(message);

    const foundMessage = await getMessagesByChannelId(
      message.messageId,
      message.dateCreated,
      10
    );

    if (foundMessage.data)
      expect(foundMessage.data[0].messageId).toBe(message.messageId);
  });

  test("ERROR: missing message id ", async () => {
    const message = await makeFakePrivateMessage(
      "123",
      "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
    );
    const insertedMessage = await createMessage(message);

    try {
      const foundMessage = await getMessagesByChannelId(
        "",
        message.dateCreated
      );
    } catch (error) {
      if (error instanceof Error)
        expect(error.message).toBe("Message Id needs to be supplied.");
    }
  });
});
