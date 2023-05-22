import makeDb from "@/server/__test__/fixures/db";
import makeFakeMessage from "@/server/__test__/fixures/message";
import groupTests from "@/server/__test__/functions/group";
import channelTests from "@/server/__test__/functions/groupChannel";
import userTests from "@/server/__test__/functions/user";

import makeMessageDb from "../data-access/message-db";
import { IGroupMessage } from "../groupMessage";
import makeCreateMessage from "../use-cases/createMessage";
import makeDeleteMessage from "../use-cases/deleteMessage";
import makeUpdateMessageText from "../use-cases/updateMessageText";
import makeUpdateMessageTextController from "./update-messageText";

describe("updating message text controller", () => {
  const messageDb = makeMessageDb({ makeDb });
  const createMessage = makeCreateMessage({ messageDb });

  const updateMessageText = makeUpdateMessageText({ messageDb });
  const updateMessageTextController = makeUpdateMessageTextController({
    updateMessageText,
  });

  const deleteGroupMessage = makeDeleteMessage({ messageDb: messageDb });
  let message: IGroupMessage;
  beforeAll(async () => {
    visetTimeout(30000);
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

  test("SUCCESS: updated message text", async () => {
    const messageRequest = {
      body: {
        messageId: message.messageId,
        updateValue: "Coder's are cool",
      },
      headers: {},
      ip: "",
      method: "",
      params: {},
      path: "",
      query: {},
    };

    await createMessage(message);

    const updatedMessage = await updateMessageTextController(messageRequest);

    expect(updatedMessage.body.data?.text).toBe("Coder's are cool");
  });

  test("ERROR: message id missing ", async () => {
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

    await createMessage(message);

    const updatedMessage = await updateMessageTextController(messageRequest);

    expect(updatedMessage.body.error).toBe("Message Id needs to be supplied.");
  });

  test("ERROR: text missing ", async () => {
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

    await createMessage(message);
    const updatedMessage = await updateMessageTextController(messageRequest);
    expect(updatedMessage.body.error).toBe(
      "Update Value needs to be supplied."
    );
  });
});
