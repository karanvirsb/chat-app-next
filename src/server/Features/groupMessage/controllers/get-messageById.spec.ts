import makeDb from "@/server/__test__/fixures/db";
import makeFakeMessage from "@/server/__test__/fixures/message";
import groupTests from "@/server/__test__/functions/group";
import channelTests from "@/server/__test__/functions/groupChannel";
import userTests from "@/server/__test__/functions/user";

import makeMessageDb from "../data-access/message-db";
import { IGroupMessage } from "../groupMessage";
import makeCreateMessage from "../use-cases/createMessage";
import makeDeleteMessage from "../use-cases/deleteMessage";
import makeGetMessageById from "../use-cases/getMessageById";
import makeGetMessageByIdController from "./get-messageById";

describe("getting a message by id controller", () => {
  const messageDb = makeMessageDb({ makeDb });
  const createMessage = makeCreateMessage({ messageDb });

  const getMessageById = makeGetMessageById({ messageDb });
  const getMessageByIdController = makeGetMessageByIdController({
    getMessageById,
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

  test("SUCCESS: getting a message", async () => {
    const messageRequest = {
      body: {},
      headers: {},
      ip: "",
      method: "",
      params: { messageId: message.messageId },
      path: "",
      query: {},
    };

    await createMessage(message);

    const foundMessage = await getMessageByIdController(messageRequest);
    expect(foundMessage.body.data?.text).toBe(message.text);
  });

  test("ERROR: message id missing ", async () => {
    const messageRequest = {
      body: {},
      headers: {},
      ip: "",
      method: "",
      params: { messageId: "" },
      path: "",
      query: {},
    };

    await createMessage(message);

    const foundMessage = await getMessageByIdController(messageRequest);
    expect(foundMessage.body.error).toBe("Message Id needs to be supplied.");
  });
});
