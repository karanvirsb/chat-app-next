import {
    IHttpRequest,
    httpResponseType,
} from "../../../express-callback/index";
import { IGroupMessage } from "../groupMessage";
import { IUpdateDateModifiedUseCase } from "../use-cases/updateDateModified";

interface IUpdateDateModifiedResponse extends httpResponseType {
    body: {
        success: boolean;
        data: IGroupMessage | undefined;
        error: string;
    };
}

export default function makeUpdateDateModifiedController({
    updateDateModified,
}: IUpdateDateModifiedUseCase) {
    return async function updateDateModifiedController(
        httpRequest: IHttpRequest
    ): Promise<IUpdateDateModifiedResponse> {
        const headers: { [key: string]: string } = {
            "Content-Type": "application/json",
        };
        try {
            const updatedMessage = await updateDateModified(
                httpRequest.body.messageId,
                new Date(httpRequest.body.updateValue)
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
