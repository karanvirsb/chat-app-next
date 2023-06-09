import makeDb from "@/server/__test__/fixures/db";
import makeFakeMessage from "@/server/__test__/fixures/message";
import groupTests from "@/server/__test__/functions/group";
import channelTests from "@/server/__test__/functions/groupChannel";
import userTests from "@/server/__test__/functions/user";

import makeMessageDb from "../data-access/message-db";
import { IGroupMessage } from "../groupMessage";
import makeCreateMessage from "./createMessage";
import makeDeleteMessage from "./deleteMessage";
import makeUpdateMessageText from "./updateMessageText";

describe("updating message text use case", () => {
  const messageDb = makeMessageDb({ makeDb });
  const createMessage = makeCreateMessage({ messageDb });
  const updateMessageText = makeUpdateMessageText({ messageDb });

  const deleteGroupMessage = makeDeleteMessage({ messageDb });
  let message: IGroupMessage;

  beforeAll(async () => {
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

  test("SUCCESS: updating a message text", async () => {
    await createMessage(message);

    const updatedMessage = await updateMessageText(
      message.messageId,
      "Coder's are awesome"
    );

    expect(updatedMessage.data?.text).toBe("Coder's are awesome");
  });

  test("ERROR: missing message id ", async () => {
    await createMessage(message);

    try {
      await updateMessageText("", "Coding");
    } catch (error) {
      if (error instanceof Error)
        expect(error.message).toBe("Message Id needs to be supplied.");
    }
  });

  test("ERROR: missing text ", async () => {
    await createMessage(message);

    try {
      await updateMessageText(message.messageId, "");
    } catch (error) {
      if (error instanceof Error)
        expect(error.message).toBe("Update Value needs to be supplied.");
    }
  });
});
