import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import makeFakeMessage from "../../../../__test__/fixures/message";
import groupTests from "../../../../__test__/functions/group";
import channelTests from "../../../../__test__/functions/groupChannel";
import userTests from "../../../../__test__/functions/user";
import makeMessageDb from "../data-access/message-db";
import makeCreateMessage from "../use-cases/createMessage";
import makeCreateMessageController from "./create-message";

describe("creating a message controller", () => {
    const messageDb = makeMessageDb({ makeDb });
    const createMessage = makeCreateMessage({ messageDb });
    const createMessageController = makeCreateMessageController({
        createMessage,
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

    test("SUCCESS: create a message", async () => {
        const message = await makeFakeMessage(
            "123",
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
        );
        const messageRequest = {
            body: {
                messageInfo: message,
            },
            headers: {},
            ip: "",
            method: "",
            params: {},
            path: "",
            query: {},
        };

        const createdMessage = await createMessageController(messageRequest);

        expect(createdMessage.body.data?.messageId).toBe(message.messageId);
    });

    test("ERROR: channel id missing ", async () => {
        const message = await makeFakeMessage(
            "",
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
        );
        const messageRequest = {
            body: {
                messageInfo: message,
            },
            headers: {},
            ip: "",
            method: "",
            params: {},
            path: "",
            query: {},
        };

        const createdMessage = await createMessageController(messageRequest);

        expect(createdMessage.body.error).toBe(
            "Channel Id needs to be supplied."
        );
    });

    test("ERROR: user id missing ", async () => {
        const message = await makeFakeMessage("123", "");
        const messageRequest = {
            body: {
                messageInfo: message,
            },
            headers: {},
            ip: "",
            method: "",
            params: {},
            path: "",
            query: {},
        };

        const createdMessage = await createMessageController(messageRequest);

        expect(createdMessage.body.error).toBe("User Id needs to be supplied.");
    });

    test("ERROR: text id missing ", async () => {
        const message = await makeFakeMessage(
            "123",
            "5c0fc896-1af1-4c26-b917-550ac5eefa9e"
        );
        message.text = "";
        const messageRequest = {
            body: {
                messageInfo: message,
            },
            headers: {},
            ip: "",
            method: "",
            params: {},
            path: "",
            query: {},
        };

        const createdMessage = await createMessageController(messageRequest);

        expect(createdMessage.body.error).toBe("Text needs to be supplied.");
    });
});
