import makeDb from "@/server/__test__/fixures/db";
import makeFakePrivateMessage from "@/server/__test__/fixures/privateMessage";
import privateChannelTests from "@/server/__test__/functions/privateChannel";
import userTests from "@/server/__test__/functions/user";

import makePrivateMessageDb from "../data-access/privateMessage-db";
import { IPrivateMessage } from "../privateMessage";
import makeCreatePrivateMessage from "../use-cases/createPrivateMessage";
import makeDeletePrivateMessage from "../use-cases/deletePrivateMessage";
import makeUpdatePrivateMessageText from "../use-cases/updatePrivateMessageText";
import makeUpdatePrivateMessageTextController from "./update-privateMessageText";

describe("updating private message text controller", () => {
  const privateMessageDb = makePrivateMessageDb({ makeDb });
  const createMessage = makeCreatePrivateMessage({ privateMessageDb });

  const updatePrivateMessageText = makeUpdatePrivateMessageText({
    privateMessageDb,
  });
  const updatePrivateMessageTextController =
    makeUpdatePrivateMessageTextController({
      updatePrivateMessageText,
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

    const updatedMessage = await updatePrivateMessageTextController(
      messageRequest
    );

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

    const updatedMessage = await updatePrivateMessageTextController(
      messageRequest
    );

    expect(updatedMessage.body.error).toBe("Message Id needs to be supplied.");
  });

  test("ERROR: text missing ", async () => {
    const message = await makeFakePrivateMessage(
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

    await createMessage(message);
    const updatedMessage = await updatePrivateMessageTextController(
      messageRequest
    );
    expect(updatedMessage.body.error).toBe(
      "Update Value needs to be supplied."
    );
  });
});
