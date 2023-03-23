import {
    IHttpRequest,
    httpResponseType,
} from "../../../express-callback/index";
import { IGroupMessage } from "../groupMessage";
import { IDeleteMessageUseCase } from "../use-cases/deleteMessage";

interface IDeleteMessageResponse extends httpResponseType {
    body: {
        success: boolean;
        data: IGroupMessage | undefined;
        error: string;
    };
}

export default function makeDeleteMessageController({
    deleteMessage,
}: IDeleteMessageUseCase) {
    return async function deleteMessageController(
        httpRequest: IHttpRequest
    ): Promise<IDeleteMessageResponse> {
        const headers: { [key: string]: string } = {
            "Content-Type": "application/json",
        };
        try {
            const deletedMessage = await deleteMessage(
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
