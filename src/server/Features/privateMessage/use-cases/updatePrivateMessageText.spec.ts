import makeDb from "@/server/__test__/fixures/db";
import makeFakePrivateMessage from "@/server/__test__/fixures/privateMessage";
import privateChannelTests from "@/server/__test__/functions/privateChannel";
import userTests from "@/server/__test__/functions/user";

import makePrivateMessageDb from "../data-access/privateMessage-db";
import { IPrivateMessage } from "../privateMessage";
import makeCreatePrivateMessage from "./createPrivateMessage";
import makeDeletePrivateMessage from "./deletePrivateMessage";
import makeUpdatePrivateMessageText from "./updatePrivateMessageText";

describe("updating private message text use case", () => {
  const privateMessageDb = makePrivateMessageDb({ makeDb });
  const createMessage = makeCreatePrivateMessage({ privateMessageDb });
  const updateMessageText = makeUpdatePrivateMessageText({
    privateMessageDb,
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
