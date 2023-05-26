import makeDb from "@/server/__test__/fixures/db";
import makeFakePrivateMessage from "@/server/__test__/fixures/privateMessage";
import privateChannelTests from "@/server/__test__/functions/privateChannel";
import userTests from "@/server/__test__/functions/user";
import id from "@/server/Utilities/id";

import makePrivateMessageDb from "../data-access/privateMessage-db";
import { IPrivateMessage } from "../privateMessage";
import makeCreatePrivateMessage from "./createPrivateMessage";
import makeDeletePrivateMessage from "./deletePrivateMessage";

describe("Deleting a private message use case", () => {
  const privateMessageDb = makePrivateMessageDb({ makeDb });
  const createPrivateMessage = makeCreatePrivateMessage({ privateMessageDb });
  const deletePrivateMessage = makeDeletePrivateMessage({ privateMessageDb });
  let message: IPrivateMessage;
  const channelUUID = id.makeId();
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
      channelId: channelUUID,
    });
  });

  beforeEach(async () => {
    message = await makeFakePrivateMessage(
      channelUUID,
      "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
    );
  });

  afterEach(async () => {
    await deletePrivateMessage(message.messageId);
  });

  afterAll(async () => {
    await privateChannelTests.deleteTestPrivateChannel({
      channelId: channelUUID,
    });
    await userTests.deleteTestUser({
      userId: "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
    });
    await userTests.deleteTestUser({
      userId: "312c0878-04c3-4585-835e-c66900ccc7a1",
    });
  });

  test("SUCCESS: deleting a message", async () => {
    const result = await createPrivateMessage(message);
    expect(result.success).toBeTruthy();
    const deletedMessage = await deletePrivateMessage(message.messageId);

    expect(deletedMessage.data?.messageId).toBe(message.messageId);
  });

  test("ERROR: message id is missing", async () => {
    const result = await createPrivateMessage(message);
    expect(result.success).toBeTruthy();

    try {
      await deletePrivateMessage("");
    } catch (error) {
      if (error instanceof Error)
        expect(error.message).toBe("Message Id needs to be supplied.");
    }
  });
});
