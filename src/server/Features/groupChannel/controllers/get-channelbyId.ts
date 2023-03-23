import {
    IHttpRequest,
    httpResponseType,
} from "../../../express-callback/index";
import { IGroupChannel } from "../groupChannel";
import { IGetChannelByIdUseCase } from "../use-cases/getChannelById";

interface IGetChannelByIdResponse extends httpResponseType {
    body: {
        success: boolean;
        data: IGroupChannel | undefined;
        error: string;
    };
}

export default function makeGetChannelByIdController({
    getChannelById,
}: IGetChannelByIdUseCase) {
    return async function getChannelByIdController(
        httpRequest: IHttpRequest
    ): Promise<IGetChannelByIdResponse> {
        const headers: { [key: string]: string } = {
            "Content-Type": "application/json",
        };
        try {
            const foundChannel = await getChannelById(
                httpRequest.params.channelId
            );
            return {
                headers,
                statusCode: 200,
                body: foundChannel,
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
