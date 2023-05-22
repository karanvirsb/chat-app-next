import makeDb from "@/server/__test__/fixures/db";
import makeFakeMessage from "@/server/__test__/fixures/message";
import groupTests from "@/server/__test__/functions/group";
import channelTests from "@/server/__test__/functions/groupChannel";
import userTests from "@/server/__test__/functions/user";

import makeMessageDb from "../data-access/message-db";
import { IGroupMessage } from "../groupMessage";
import makeCreateMessage from "../use-cases/createMessage";
import makeDeleteMessage from "../use-cases/deleteMessage";
import makeGetMessagesByChannelId from "../use-cases/getMessagesByChannelId";
import makeGetMessagesByChannelIdController from "./get-messagesByChannelId";

describe("getting messages by channel id controller", () => {
  const messageDb = makeMessageDb({ makeDb });
  const createMessage = makeCreateMessage({ messageDb });

  const getMessagesByChannelId = makeGetMessagesByChannelId({ messageDb });
  const getMessagesByChannelIdController = makeGetMessagesByChannelIdController(
    {
      getMessagesByChannelId,
    }
  );

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

  test("SUCCESS: getting a message", async () => {
    const messageRequest = {
      body: {},
      headers: {},
      ip: "",
      method: "",
      params: {
        messageId: message.messageId,
        dateCreated: message.dateCreated.toString(),
        limit: "10",
      },
      path: "",
      query: {},
    };

    await createMessage(message);

    const foundMessage = await getMessagesByChannelIdController(messageRequest);
    if (foundMessage.body.success && foundMessage.body.data)
      expect(foundMessage.body.data.data[0].text).toBe(message.text);
  });

  test("ERROR: message id missing ", async () => {
    const messageRequest = {
      body: {},
      headers: {},
      ip: "",
      method: "",
      params: {
        messageId: "",
        dateCreated: message.dateCreated.toString(),
        limit: "10",
      },
      path: "",
      query: {},
    };

    await createMessage(message);

    const foundMessages = await getMessagesByChannelIdController(
      messageRequest
    );

    expect(foundMessages.body.error).toBe("Message Id needs to be supplied.");
  });

  test("ERROR: date created missing ", async () => {
    const messageRequest = {
      body: {},
      headers: {},
      ip: "",
      method: "",
      params: {
        messageId: message.messageId,
        dateCreated: "",
        limit: "10",
      },
      path: "",
      query: {},
    };

    await createMessage(message);

    const foundMessages = await getMessagesByChannelIdController(
      messageRequest
    );

    expect(foundMessages.body.error).toBe("Date Created needs to be supplied.");
  });
});
