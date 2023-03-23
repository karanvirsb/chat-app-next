import {
    IHttpRequest,
    httpResponseType,
} from "../../../express-callback/index";
import { IPrivateMessage } from "../privateMessage";
import { IUpdatePrivateMessageTextUseCase } from "../use-cases/updatePrivateMessageText";

interface IUpdatePrivateMessageTextResponse extends httpResponseType {
    body: {
        success: boolean;
        data: IPrivateMessage | undefined;
        error: string;
    };
}

export default function makeUpdatePrivateMessageTextController({
    updatePrivateMessageText,
}: IUpdatePrivateMessageTextUseCase) {
    return async function updatePrivateMessageTextController(
        httpRequest: IHttpRequest
    ): Promise<IUpdatePrivateMessageTextResponse> {
        const headers: { [key: string]: string } = {
            "Content-Type": "application/json",
        };
        try {
            const updatedMessage = await updatePrivateMessageText(
                httpRequest.body.messageId,
                httpRequest.body.updateValue
            );
            return {
                headers,
                statusCode: 200,
                body: updatedMessage,
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
