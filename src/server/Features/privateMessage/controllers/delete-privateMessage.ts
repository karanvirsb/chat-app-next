import {
    IHttpRequest,
    httpResponseType,
} from "../../../express-callback/index";
import { IPrivateMessage } from "../privateMessage";
import { IDeletePrivateMessageUseCase } from "../use-cases/deletePrivateMessage";

interface IDeletePrivateMessageResponse extends httpResponseType {
    body: {
        success: boolean;
        data: IPrivateMessage | undefined;
        error: string;
    };
}

export default function makeDeletePrivateMessageController({
    deletePrivateMessage,
}: IDeletePrivateMessageUseCase) {
    return async function deletePrivateMessageController(
        httpRequest: IHttpRequest
    ): Promise<IDeletePrivateMessageResponse> {
        const headers: { [key: string]: string } = {
            "Content-Type": "application/json",
        };
        try {
            const deletedMessage = await deletePrivateMessage(
                httpRequest.body.messageId
            );
            return {
                headers,
                statusCode: 200,
                body: deletedMessage,
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
