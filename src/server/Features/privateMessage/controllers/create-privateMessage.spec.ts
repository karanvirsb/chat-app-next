import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import makeFakePrivateMessage from "../../../../__test__/fixures/privateMessage";
import privateChannelTests from "../../../../__test__/functions/privateChannel";
import userTests from "../../../../__test__/functions/user";
import makePrivateChannelDb from "../../privateChannel/data-access/privateChannel-db";
import makePrivateMessageDb from "../data-access/privateMessage-db";
import makeCreatePrivateMessage from "../use-cases/createPrivateMessage";
import makeCreatePrivateMessageController from "./create-privateMessage";

describe("creating a private message controller", () => {
    const privateMessageDb = makePrivateMessageDb({ makeDb });
    const createPrivateMessage = makeCreatePrivateMessage({ privateMessageDb });
    const createPrivateMessageController = makeCreatePrivateMessageController({
        createPrivateMessage,
    });

    jest.setTimeout(30000);
    beforeAll(async () => {
        const addedUser = await userTests.addTestUserToDB({
            userId: "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
        });
        const secondUser = await userTests.addTestUserToDB({
            userId: "312c0878-04c3-4585-835e-c66900ccc7a1",
        });
        const privateChannel =
            await privateChannelTests.createTestPrivateChannel({
                userId: "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
                friendsId: "312c0878-04c3-4585-835e-c66900ccc7a1",
                channelId: "123",
            });
    });

    afterAll(async () => {
        await clearDb("private_messages");
        const deletedPrivateChannel =
            await privateChannelTests.deleteTestPrivateChannel({
                channelId: "123",
            });
        const deletedUser = await userTests.deleteTestUser({
            userId: "5c0fc896-1af1-4c26-b917-550ac5eefa9e",
        });
        const deletedSecondUser = await userTests.deleteTestUser({
            userId: "312c0878-04c3-4585-835e-c66900ccc7a1",
        });
    });

    test("SUCCESS: create a message", async () => {
        const message = await makeFakePrivateMessage(
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

        const createdMessage = await createPrivateMessageController(
            messageRequest
        );

        expect(createdMessage.body.data?.messageId).toBe(message.messageId);
    });

    test("ERROR: channel id missing ", async () => {
        const message = await makeFakePrivateMessage(
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

        const createdMessage = await createPrivateMessageController(
            messageRequest
        );

        expect(createdMessage.body.error).toBe(
            "Channel Id needs to be supplied."
        );
    });

    test("ERROR: user id missing ", async () => {
        const message = await makeFakePrivateMessage("123", "");
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

        const createdMessage = await createPrivateMessageController(
            messageRequest
        );

        expect(createdMessage.body.error).toBe("User Id needs to be supplied.");
    });

    test("ERROR: text id missing ", async () => {
        const message = await makeFakePrivateMessage(
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

        const createdMessage = await createPrivateMessageController(
            messageRequest
        );

        expect(createdMessage.body.error).toBe("Text needs to be supplied.");
    });
});
