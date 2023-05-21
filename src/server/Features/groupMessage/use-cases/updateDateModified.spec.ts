import makeDb, { clearDb } from "@/server/__test__/fixures/db";
import makeFakeMessage from "@/server/__test__/fixures/message";
import groupTests from "@/server/__test__/functions/group";
import channelTests from "@/server/__test__/functions/groupChannel";
import userTests from "@/server/__test__/functions/user";

import makeMessageDb from "../data-access/message-db";
import makeCreateMessage from "./createMessage";
import makeUpdateDateModified from "./updateDateModified";

describe("Update message date modified use case", () => {
  const messageDb = makeMessageDb({ makeDb });
  const createMessage = makeCreateMessage({ messageDb });
  const updateDateModified = makeUpdateDateModified({ messageDb });

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
    // TODO await clearDb("group_messages");
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

  test("SUCCESS: updating date modified", async () => {
    jest.setTimeout(15000);
    const message = await makeFakeMessage(
      "123",
      "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
    );
    const insertedMessage = await createMessage(message);

    const updatedMessage = await updateDateModified(
      message.messageId,
      new Date()
    );

    expect(updatedMessage.data?.dateModified).not.toEqual(message.dateModified);
  });

  test("ERROR: missing message id ", async () => {
    const message = await makeFakeMessage(
      "123",
      "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
    );
    const insertedMessage = await createMessage(message);

    try {
      const updateMessage = await updateDateModified("", new Date());
    } catch (error) {
      if (error instanceof Error)
        expect(error.message).toBe("Message Id needs to be supplied.");
    }
  });
});
