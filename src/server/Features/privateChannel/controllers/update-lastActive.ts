import {
    IHttpRequest,
    httpResponseType,
} from "../../../express-callback/index";
import { IPrivateChannel } from "../privateChannel";
import { IUpdateLastActiveUseCase } from "../use-cases/updateLastActive";

interface IUpdateLastActiveResponse extends httpResponseType {
    body: {
        success: boolean;
        data: IPrivateChannel | undefined;
        error: string;
    };
}

export default function makeUpdateLastActiveController({
    updateLastActive,
}: IUpdateLastActiveUseCase) {
    return async function updateLastActiveController(
        httpRequest: IHttpRequest
    ): Promise<IUpdateLastActiveResponse> {
        const headers: { [key: string]: string } = {
            "Content-Type": "application/json",
        };
        try {
            const updatedChannel = await updateLastActive(
                httpRequest.body.channelId,
                httpRequest.body.newDate
            );
            return {
                headers,
                statusCode: 200,
                body: updatedChannel,
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
