import makeDb, { clearDb } from "../../../../__test__/fixures/db";
import makeFakePrivateMessage from "../../../../__test__/fixures/privateMessage";
import privateChannelTests from "../../../../__test__/functions/privateChannel";
import userTests from "../../../../__test__/functions/user";
import makePrivateChannelDb from "../../privateChannel/data-access/privateChannel-db";
import makePrivateMessageDb from "../data-access/privateMessage-db";
import makeCreatePrivateMessage from "../use-cases/createPrivateMessage";
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

    test("SUCCESS: updated message text", async () => {
        const message = await makeFakePrivateMessage(
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

        const updatedMessage = await updatePrivateMessageTextController(
            messageRequest
        );

        expect(updatedMessage.body.data?.text).toBe("Coder's are cool");
    });

    test("ERROR: message id missing ", async () => {
        const message = await makeFakePrivateMessage(
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

        const updatedMessage = await updatePrivateMessageTextController(
            messageRequest
        );

        expect(updatedMessage.body.error).toBe(
            "Message Id needs to be supplied."
        );
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

        const createdMessage = await createMessage(message);
        const updatedMessage = await updatePrivateMessageTextController(
            messageRequest
        );
        expect(updatedMessage.body.error).toBe(
            "Update Value needs to be supplied."
        );
    });
});
