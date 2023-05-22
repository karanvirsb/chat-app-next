import makeDb from "@/server/__test__/fixures/db";
import makeFakeMessage from "@/server/__test__/fixures/message";
import groupTests from "@/server/__test__/functions/group";
import channelTests from "@/server/__test__/functions/groupChannel";
import userTests from "@/server/__test__/functions/user";

import makeMessageDb from "../data-access/message-db";
import { IGroupMessage } from "../groupMessage";
import makeCreateMessage from "../use-cases/createMessage";
import makeDeleteMessage from "../use-cases/deleteMessage";
import makeCreateMessageController from "./create-message";

describe("creating a message controller", () => {
  const messageDb = makeMessageDb({ makeDb });
  const createMessage = makeCreateMessage({ messageDb });
  const createMessageController = makeCreateMessageController({
    createMessage,
  });

  const deleteGroupMessage = makeDeleteMessage({ messageDb: messageDb });
  let message: IGroupMessage;
  beforeAll(async () => {
    jest.setTimeout(30000);
    await userTests.addTestUserToDB({
      userId: "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
    });
    await groupTests.createTestGroup({
      groupId: "123",
      userId: "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
    });
    await channelTests.createTestChannel({
      groupId: "123",
      channelId: "123",
    });
  });

  beforeEach(async () => {
    message = await makeFakeMessage(
      "123",
      "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
    );
  });

  afterEach(async () => {
    await deleteGroupMessage(message.messageId);
  });

  afterAll(async () => {
    await channelTests.deleteTestChannel({
      channelId: "123",
    });
    await groupTests.deleteTestGroup({
      groupId: "123",
      userId: "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
    });
    await userTests.deleteTestUser({
      userId: "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
    });
  });

  test("SUCCESS: create a message", async () => {
    const messageRequest = {
      body: {
        messageInfo: message,
      },
      headers: {},
      ip: "",
      method: "",
      params: {},
      path: "",
      query: {},
    };

    const createdMessage = await createMessageController(messageRequest);
    if (createdMessage.body.success)
      expect(createdMessage.body.data?.messageId).toBe(message.messageId);
  });

  test("ERROR: channel id missing ", async () => {
    message["channelId"] = "";
    const messageRequest = {
      body: {
        messageInfo: message,
      },
      headers: {},
      ip: "",
      method: "",
      params: {},
      path: "",
      query: {},
    };

    const createdMessage = await createMessageController(messageRequest);
    if (!createdMessage.body.success)
      expect(createdMessage.body.error).toBe(
        "Channel Id needs to be supplied."
      );
  });

  test("ERROR: user id missing ", async () => {
    message["userId"] = "";
    const messageRequest = {
      body: {
        messageInfo: message,
      },
      headers: {},
      ip: "",
      method: "",
      params: {},
      path: "",
      query: {},
    };

    const createdMessage = await createMessageController(messageRequest);
    if (!createdMessage.body.success)
      expect(createdMessage.body.error).toBe("User Id needs to be supplied.");
  });

  test("ERROR: text id missing ", async () => {
    message["text"] = "";
    const messageRequest = {
      body: {
        messageInfo: message,
      },
      headers: {},
      ip: "",
      method: "",
      params: {},
      path: "",
      query: {},
    };

    const createdMessage = await createMessageController(messageRequest);
    if (!createdMessage.body.success)
      expect(createdMessage.body.error).toBe("Text needs to be supplied.");
  });
});
