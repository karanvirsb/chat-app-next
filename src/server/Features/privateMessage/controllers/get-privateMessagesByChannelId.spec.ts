import makeDb from "@/server/__test__/fixures/db";
import makeFakePrivateMessage from "@/server/__test__/fixures/privateMessage";
import privateChannelTests from "@/server/__test__/functions/privateChannel";
import userTests from "@/server/__test__/functions/user";

import makePrivateMessageDb from "../data-access/privateMessage-db";
import { IPrivateMessage } from "../privateMessage";
import makeCreatePrivateMessage from "../use-cases/createPrivateMessage";
import makeDeletePrivateMessage from "../use-cases/deletePrivateMessage";
import makeGetPrivateMessagesByChannelId from "../use-cases/getPrivateMessagesByChannelId";
import makeGetPrivateMessagesByChannelIdController from "./get-privateMessagesByChannelId";

describe("getting private messages by channel id controller", () => {
  const privateMessageDb = makePrivateMessageDb({ makeDb });
  const createMessage = makeCreatePrivateMessage({ privateMessageDb });

  const getPrivateMessagesByChannelId = makeGetPrivateMessagesByChannelId({
    privateMessageDb,
  });
  const getPrivateMessagesByChannelIdController =
    makeGetPrivateMessagesByChannelIdController({
      getPrivateMessagesByChannelId,
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

    const foundMessage = await getPrivateMessagesByChannelIdController(
      messageRequest
    );
    if (foundMessage.body.data)
      expect(foundMessage.body.data[0].text).toBe(message.text);
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

    const foundMessages = await getPrivateMessagesByChannelIdController(
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

    const foundMessages = await getPrivateMessagesByChannelIdController(
      messageRequest
    );

    expect(foundMessages.body.error).toBe("Date Created needs to be supplied.");
  });
});
