import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import makeFakeMessage from "../../../../__test__/fixures/message";
import groupTests from "../../../../__test__/functions/group";
import channelTests from "../../../../__test__/functions/groupChannel";
import userTests from "../../../../__test__/functions/user";
import makeMessageDb from "../data-access/message-db";
import makeCreateMessage from "./createMessage";

describe("Create message use case", () => {
  const messageDb = makeMessageDb({ makeDb });
  const createMessage = makeCreateMessage({ messageDb });

  beforeAll(async () => {
    jest.setTimeout(30000);
    const addedUser = await userTests.addTestUserToDB({
      userId: "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
    });
    const addedGroup = await groupTests.createTestGroup({
      groupId: "123",
      userId: "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
    });
    const addedChannel = await channelTests.createTestChannel({
      groupId: "123",
      channelId: "123",
    });
  });

  afterAll(async () => {
    await clearDb("group_messages");
    const deletedChannel = await channelTests.deleteTestChannel({
      channelId: "123",
    });
    const deletedGroup = await groupTests.deleteTestGroup({
      groupId: "123",
      userId: "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
    });
    const deletedUser = await userTests.deleteTestUser({
      userId: "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
    });
  });

  test("SUCCESS: creating a message", async () => {
    jest.setTimeout(30000);
    const message = await makeFakeMessage(
      "123",
      "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
    );
    const insertedMessage = await createMessage(message);

    expect(insertedMessage.data?.messageId).toBe(message.messageId);
  });

  test("ERROR: channelId not given", async () => {
    const message = await makeFakeMessage(
      "123",
      "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
    );

    try {
      message.channelId = "";
      const insertedMessage = await createMessage(message);
    } catch (error) {
      if (error instanceof Error)
        expect(error.message).toBe("Channel Id needs to be supplied.");
    }
  });

  test("ERROR: text not given", async () => {
    const message = await makeFakeMessage(
      "123",
      "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
    );

    try {
      message.text = "";
      const insertedMessage = await createMessage(message);
    } catch (error) {
      if (error instanceof Error)
        expect(error.message).toBe("Text needs to be supplied.");
    }
  });

  test("ERROR: user id not given", async () => {
    const message = await makeFakeMessage(
      "123",
      "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
    );

    try {
      message.userId = "";
      const insertedMessage = await createMessage(message);
    } catch (error) {
      if (error instanceof Error)
        expect(error.message).toBe("User Id needs to be supplied.");
    }
  });
});
