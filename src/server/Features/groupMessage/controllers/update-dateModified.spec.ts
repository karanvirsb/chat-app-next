import makeDb, { clearDb } from "@/server/__test__/fixures/db";
import makeFakeMessage from "@/server/__test__/fixures/message";
import groupTests from "@/server/__test__/functions/group";
import channelTests from "@/server/__test__/functions/groupChannel";
import userTests from "@/server/__test__/functions/user";

import makeMessageDb from "../data-access/message-db";
import makeCreateMessage from "../use-cases/createMessage";
import makeUpdateDateModified from "../use-cases/updateDateModified";
import makeUpdateDateModifiedController from "./update-dateModified";

describe("updating message date modified controller", () => {
  const messageDb = makeMessageDb({ makeDb });
  const createMessage = makeCreateMessage({ messageDb });

  const updateDateModified = makeUpdateDateModified({ messageDb });
  const updateDateModifiedController = makeUpdateDateModifiedController({
    updateDateModified,
  });

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

  test("SUCCESS: updated date modified", async () => {
    const message = await makeFakeMessage(
      "123",
      "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
    );
    const messageRequest = {
      body: {
        messageId: message.messageId,
        updateValue: new Date().toString(),
      },
      headers: {},
      ip: "",
      method: "",
      params: {},
      path: "",
      query: {},
    };

    const createdMessage = await createMessage(message);

    const updatedMessage = await updateDateModifiedController(messageRequest);

    expect(updatedMessage.body.data?.dateModified).not.toEqual(
      message.dateModified
    );
  });

  test("ERROR: message id missing ", async () => {
    const message = await makeFakeMessage(
      "123",
      "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
    );
    const messageRequest = {
      body: {
        messageId: "",
        updateValue: new Date().toString(),
      },
      headers: {},
      ip: "",
      method: "",
      params: {},
      path: "",
      query: {},
    };

    const createdMessage = await createMessage(message);

    const updatedMessage = await updateDateModifiedController(messageRequest);

    expect(updatedMessage.body.error).toBe("Message Id needs to be supplied.");
  });

  test("ERROR: date modified missing ", async () => {
    const message = await makeFakeMessage(
      "123",
      "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
    );
    const messageRequest = {
      body: {
        messageId: message.messageId,
        updateValue: "",
      },
      headers: {},
      ip: "",
      method: "",
      params: {},
      path: "",
      query: {},
    };

    const createdMessage = await createMessage(message);
    const updatedMessage = await updateDateModifiedController(messageRequest);
    expect(updatedMessage.body.error).toBe("Update Value needs to be a Date.");
  });
});
