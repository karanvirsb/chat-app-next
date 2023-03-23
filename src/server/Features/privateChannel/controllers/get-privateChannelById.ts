import {
    IHttpRequest,
    httpResponseType,
} from "../../../express-callback/index";
import { IPrivateChannel } from "../privateChannel";
import { IGetPrivateChannelByIdUseCase } from "../use-cases/getPrivateChannelById";

interface IGetPrivateChannelByIdResponse extends httpResponseType {
    body: {
        success: boolean;
        data: IPrivateChannel | undefined;
        error: string;
    };
}

export default function makeGetPrivateChannelByIdController({
    getPrivateChannelById,
}: IGetPrivateChannelByIdUseCase) {
    return async function getPrivateChannelByIdController(
        httpRequest: IHttpRequest
    ): Promise<IGetPrivateChannelByIdResponse> {
        const headers: { [key: string]: string } = {
            "Content-Type": "application/json",
        };
        try {
            const foundChannel = await getPrivateChannelById(
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
