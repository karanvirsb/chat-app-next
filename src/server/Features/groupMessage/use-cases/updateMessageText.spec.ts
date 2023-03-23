import makeMessageDb from "../data-access/message-db";
import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import makeCreateMessage from "./createMessage";
import makeFakeMessage from "../../../../__test__/fixures/message";
import makeUpdateMessageText from "./updateMessageText";
import channelTests from "../../../../__test__/functions/groupChannel";
import groupTests from "../../../../__test__/functions/group";
import userTests from "../../../../__test__/functions/user";

describe("updating message text use case", () => {
    jest.setTimeout(15000);
    const messageDb = makeMessageDb({ makeDb });
    const createMessage = makeCreateMessage({ messageDb });
    const updateMessageText = makeUpdateMessageText({ messageDb });

    beforeAll(async () => {
        jest.setTimeout(30000);
        const addedUser = await userTests.addTestUserToDB({
            userId: "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
        });
        const addedGroup = await groupTests.createTestGroup({
            groupId: "123",
            userId: "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
        });
        const addedChannel = await channelTests.createTestChannel({
            groupId: "123",
            channelId: "123",
        });
    });

    afterAll(async () => {
        await clearDb("group_messages");
        const deletedChannel = await channelTests.deleteTestChannel({
            channelId: "123",
        });
        const deletedGroup = await groupTests.deleteTestGroup({
            groupId: "123",
            userId: "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
        });
        const deletedUser = await userTests.deleteTestUser({
            userId: "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
        });
    });

    test("SUCCESS: updating a message text", async () => {
        const message = await makeFakeMessage(
            "123",
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
        );
        const insertedMessage = await createMessage(message);

        const updatedMessage = await updateMessageText(
            message.messageId,
            "Coder's are awesome"
        );

        expect(updatedMessage.data?.text).toBe("Coder's are awesome");
    });

    test("ERROR: missing message id ", async () => {
        const message = await makeFakeMessage(
            "123",
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
        );
        const insertedMessage = await createMessage(message);

        try {
            const updateMessage = await updateMessageText("", "Coding");
        } catch (error) {
            if (error instanceof Error)
                expect(error.message).toBe("Message Id needs to be supplied.");
        }
    });

    test("ERROR: missing text ", async () => {
        const message = await makeFakeMessage(
            "123",
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
        );
        const insertedMessage = await createMessage(message);

        try {
            const updateMessage = await updateMessageText(
                message.messageId,
                ""
            );
        } catch (error) {
            if (error instanceof Error)
                expect(error.message).toBe(
                    "Update Value needs to be supplied."
                );
        }
    });
});
