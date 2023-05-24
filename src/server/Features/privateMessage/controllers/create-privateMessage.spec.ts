import makeDb from "@/server/__test__/fixures/db";
import makeFakePrivateMessage from "@/server/__test__/fixures/privateMessage";
import privateChannelTests from "@/server/__test__/functions/privateChannel";
import userTests from "@/server/__test__/functions/user";

import makePrivateMessageDb from "../data-access/privateMessage-db";
import { IPrivateMessage } from "../privateMessage";
import makeCreatePrivateMessage from "../use-cases/createPrivateMessage";
import makeDeletePrivateMessage from "../use-cases/deletePrivateMessage";
import makeCreatePrivateMessageController from "./create-privateMessage";

describe("creating a private message controller", () => {
  const privateMessageDb = makePrivateMessageDb({ makeDb });
  const createPrivateMessage = makeCreatePrivateMessage({ privateMessageDb });
  const createPrivateMessageController = makeCreatePrivateMessageController({
    createPrivateMessage,
  });

  const deletePrivateMessage = makeDeletePrivateMessage({ privateMessageDb });
  let message: IPrivateMessage;

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

  beforeEach(async () => {
    message = await makeFakePrivateMessage(
      "123",
      "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
    );
  });

  afterEach(async () => {
    await deletePrivateMessage(message.messageId);
  });

  afterAll(async () => {
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

    const createdMessage = await createPrivateMessageController(messageRequest);

    expect(createdMessage.body.data?.messageId).toBe(message.messageId);
  });

  test("ERROR: channel id missing ", async () => {
    message["privateChannelId"] = "";

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

    const createdMessage = await createPrivateMessageController(messageRequest);

    expect(createdMessage.body.error).toBe("Channel Id needs to be supplied.");
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

    const createdMessage = await createPrivateMessageController(messageRequest);

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

    const createdMessage = await createPrivateMessageController(messageRequest);

    expect(createdMessage.body.error).toBe("Text needs to be supplied.");
  });
});
