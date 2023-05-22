import makeDb from "@/server/__test__/fixures/db";
import makeFakePrivateMessage from "@/server/__test__/fixures/privateMessage";
import privateChannelTests from "@/server/__test__/functions/privateChannel";
import userTests from "@/server/__test__/functions/user";

import makePrivateMessageDb from "../data-access/privateMessage-db";
import makeCreatePrivateMessage from "./createPrivateMessage";

describe("Create private message use case", () => {
  const privateMessageDb = makePrivateMessageDb({ makeDb });
  const createMessage = makeCreatePrivateMessage({ privateMessageDb });

  jest.setTimeout(30000);
  beforeAll(async () => {
    await userTests.addTestUserToDB({
      userId: "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
    });
    await userTests.addTestUserToDB({
      userId: "312c0878-04c3-4585-835e-c66900ccc7a1",
    });
    await privateChannelTests.createTestPrivateChannel({
      userId: "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
      friendsId: "312c0878-04c3-4585-835e-c66900ccc7a1",
      channelId: "123",
    });
  });

  afterAll(async () => {
    // TODO await clearDb("private_messages");

    await privateChannelTests.deleteTestPrivateChannel({
      channelId: "123",
    });
    await userTests.deleteTestUser({
      userId: "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
    });
    await userTests.deleteTestUser({
      userId: "312c0878-04c3-4585-835e-c66900ccc7a1",
    });
  });

  test("SUCCESS: creating a message", async () => {
    jest.setTimeout(30000);
    const message = await makeFakePrivateMessage(
      "123",
      "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
    );
    const insertedMessage = await createMessage(message);

    expect(insertedMessage.data?.messageId).toBe(message.messageId);
  });

  test("ERROR: channelId not given", async () => {
    const message = await makeFakePrivateMessage(
      "123",
      "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
    );

    try {
      message.privateChannelId = "";
      await createMessage(message);
    } catch (error) {
      if (error instanceof Error)
        expect(error.message).toBe("Channel Id needs to be supplied.");
    }
  });

  test("ERROR: text not given", async () => {
    const message = await makeFakePrivateMessage(
      "123",
      "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
    );

    try {
      message.text = "";
      await createMessage(message);
    } catch (error) {
      if (error instanceof Error)
        expect(error.message).toBe("Text needs to be supplied.");
    }
  });

  test("ERROR: user id not given", async () => {
    const message = await makeFakePrivateMessage(
      "123",
      "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
    );

    try {
      message.userId = "";
      await createMessage(message);
    } catch (error) {
      if (error instanceof Error)
        expect(error.message).toBe("User Id needs to be supplied.");
    }
  });
});
