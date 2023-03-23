import {
    IHttpRequest,
    httpResponseType,
} from "../../../express-callback/index";
import { IPrivateMessage } from "../privateMessage";
import { IGetPrivateMessageByIdUseCase } from "../use-cases/getPrivateMessageById";

interface IGetPrivateMessageByIdResponse extends httpResponseType {
    body: {
        success: boolean;
        data: IPrivateMessage | undefined;
        error: string;
    };
}

export default function makeGetPrivateMessageByIdController({
    getPrivateMessageById,
}: IGetPrivateMessageByIdUseCase) {
    return async function getPrivateMessageByIdController(
        httpRequest: IHttpRequest
    ): Promise<IGetPrivateMessageByIdResponse> {
        const headers: { [key: string]: string } = {
            "Content-Type": "application/json",
        };
        try {
            const foundMessage = await getPrivateMessageById(
                httpRequest.params.messageId
            );
            return {
                headers,
                statusCode: 200,
                body: foundMessage,
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
