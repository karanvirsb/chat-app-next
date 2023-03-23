import {
    IHttpRequest,
    httpResponseType,
} from "../../../express-callback/index";
import { IPrivateMessage } from "../privateMessage";
import { IGetPrivateMessagesByChannelIdUseCase } from "../use-cases/getPrivateMessagesByChannelId";

interface IGetPrivateMessagesByChannelIdResponse extends httpResponseType {
    body: {
        success: boolean;
        data: IPrivateMessage[] | undefined;
        error: string;
    };
}

export default function makeGetPrivateMessagesByChannelIdController({
    getPrivateMessagesByChannelId,
}: IGetPrivateMessagesByChannelIdUseCase) {
    return async function getPrivateMessagesByChannelIdController(
        httpRequest: IHttpRequest
    ): Promise<IGetPrivateMessagesByChannelIdResponse> {
        const headers: { [key: string]: string } = {
            "Content-Type": "application/json",
        };
        try {
            const foundMessages = await getPrivateMessagesByChannelId(
                httpRequest.params.messageId,
                new Date(httpRequest.params.dateCreated),
                parseInt(httpRequest.params.limit)
            );
            return {
                headers,
                statusCode: 200,
                body: foundMessages,
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
