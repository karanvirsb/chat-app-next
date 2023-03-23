import {
    IHttpRequest,
    httpResponseType,
} from "../../../express-callback/index";
import { IPrivateMessage } from "../privateMessage";
import { ICreatePrivateMessageUseCase } from "../use-cases/createPrivateMessage";

interface ICreatePrivateMessageResponse extends httpResponseType {
    body: {
        success: boolean;
        data: IPrivateMessage | undefined;
        error: string;
    };
}

export default function makeCreatePrivateMessageController({
    createPrivateMessage,
}: ICreatePrivateMessageUseCase) {
    return async function createPrivateMessageController(
        httpRequest: IHttpRequest
    ): Promise<ICreatePrivateMessageResponse> {
        const headers: { [key: string]: string } = {
            "Content-Type": "application/json",
        };
        try {
            const createdMessage = await createPrivateMessage(
                httpRequest.body.messageInfo
            );
            return {
                headers,
                statusCode: 200,
                body: createdMessage,
            };
        } catch (error: any) {
            console.log(error);
            return {
                headers,
                statusCode: 400,
                body: {
                    success: false,
                    data: undefined,
                    error: error.message,
                },
            };
        }
    };
}
