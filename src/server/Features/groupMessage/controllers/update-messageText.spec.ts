import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import makeFakeMessage from "../../../../__test__/fixures/message";
import groupTests from "../../../../__test__/functions/group";
import channelTests from "../../../../__test__/functions/groupChannel";
import userTests from "../../../../__test__/functions/user";
import makeMessageDb from "../data-access/message-db";
import makeCreateMessage from "../use-cases/createMessage";
import makeUpdateDateModified from "../use-cases/updateDateModified";
import makeUpdateMessageText from "../use-cases/updateMessageText";
import makeUpdateDateModifiedController from "./update-dateModified";
import makeUpdateMessageTextController from "./update-messageText";

describe("updating message text controller", () => {
    const messageDb = makeMessageDb({ makeDb });
    const createMessage = makeCreateMessage({ messageDb });

    const updateMessageText = makeUpdateMessageText({ messageDb });
    const updateMessageTextController = makeUpdateMessageTextController({
        updateMessageText,
    });

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
    test("SUCCESS: updated message text", async () => {
        const message = await makeFakeMessage(
            "123",
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
        );
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

        const createdMessage = await createMessage(message);

        const updatedMessage = await updateMessageTextController(
            messageRequest
        );

        expect(updatedMessage.body.data?.text).toBe("Coder's are cool");
    });

    test("ERROR: message id missing ", async () => {
        const message = await makeFakeMessage(
            "123",
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
        );
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

        const createdMessage = await createMessage(message);

        const updatedMessage = await updateMessageTextController(
            messageRequest
        );

        expect(updatedMessage.body.error).toBe(
            "Message Id needs to be supplied."
        );
    });

    test("ERROR: text missing ", async () => {
        const message = await makeFakeMessage(
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

        const createdMessage = await createMessage(message);
        const updatedMessage = await updateMessageTextController(
            messageRequest
        );
        expect(updatedMessage.body.error).toBe(
            "Update Value needs to be supplied."
        );
    });
});
