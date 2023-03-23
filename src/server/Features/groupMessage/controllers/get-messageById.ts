import {
    IHttpRequest,
    httpResponseType,
} from "../../../express-callback/index";
import { IGroupMessage } from "../groupMessage";
import { IGetMessageByIdUseCase } from "../use-cases/getMessageById";

interface IGetMessageByIdResponse extends httpResponseType {
    body: {
        success: boolean;
        data: IGroupMessage | undefined;
        error: string;
    };
}

export default function makeGetMessageByIdController({
    getMessageById,
}: IGetMessageByIdUseCase) {
    return async function getMessageByIdController(
        httpRequest: IHttpRequest
    ): Promise<IGetMessageByIdResponse> {
        const headers: { [key: string]: string } = {
            "Content-Type": "application/json",
        };
        try {
            const foundMessage = await getMessageById(
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
