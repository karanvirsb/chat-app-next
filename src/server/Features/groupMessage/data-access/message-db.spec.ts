import makeDb from "@/server/__test__/fixures/db";
import makeFakeMessage from "@/server/__test__/fixures/message";
import groupTests from "@/server/__test__/functions/group";
import channelTests from "@/server/__test__/functions/groupChannel";
import userTests from "@/server/__test__/functions/user";

import { IGroupMessage } from "../groupMessage";
import makeDeleteMessage from "../use-cases/deleteMessage";
import makeMessageDb from "./message-db";

describe("Message db method tests", () => {
  visetTimeout(10000);
  const messageDB = makeMessageDb({ makeDb });

  const deleteGroupMessage = makeDeleteMessage({ messageDb: messageDB });
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

  test("SUCCESS: creating a message", async () => {
    const insertedMessage = await messageDB.createMessage(message);
    expect(insertedMessage.data?.messageId).toBe(message.messageId);
  });

  test("SUCCESS: deleting a message", async () => {
    visetTimeout(30000);
    await messageDB.createMessage(message);
    const deletedMessage = await messageDB.deleteMessage(message.messageId);
    expect(deletedMessage.data?.messageId).toBe(message.messageId);
  });

  test("SUCCESS: getting message by id", async () => {
    visetTimeout(30000);
    await messageDB.createMessage(message);
    const foundMessage = await messageDB.getMessageById(message.messageId);
    expect(foundMessage.data?.text).toBe(message.text);
  });

  // TODO promise all
  test.skip("SUCCESS: getting messages by channel id", async () => {
    visetTimeout(30000);
    let message = await makeFakeMessage("123", "1234");
    let insertedMessage = await messageDB.createMessage(message);
    for (let i = 0; i < 10; i++) {
      message = await makeFakeMessage("123", "1234");

      insertedMessage = await messageDB.createMessage(message);
    }
    const foundMessages = await messageDB.getMessagesByChannelId(
      "123",
      message.dateCreated,
      10
    );
    console.log(foundMessages);
    if (foundMessages.success && foundMessages.data && insertedMessage.data)
      expect(foundMessages.data.data[1].text).toBe(insertedMessage.data.text);
  });

  test("SUCCESS: updating message", async () => {
    visetTimeout(30000);
    await messageDB.createMessage(message);
    const updatedMessage = await messageDB.updateMessage(
      "text",
      message.messageId,
      "'Coders are cool'"
    );
    expect(updatedMessage.data?.text).toBe("Coders are cool");
  });

  test("SUCCESS: updating message date", async () => {
    visetTimeout(30000);
    await messageDB.createMessage(message);
    const updatedMessage = await messageDB.updateMessage(
      "dateModified",
      message.messageId,
      `to_timestamp(${new Date().getTime() / 1000})`
    );

    expect(updatedMessage.data?.dateModified).not.toEqual(message.dateModified);
  });
});
