import {
    IHttpRequest,
    httpResponseType,
} from "../../../express-callback/index";
import { IGroupChannel } from "../groupChannel";
import { ICreateChannelUseCase } from "../use-cases/createChannel";

interface ICreateChannelResponse extends httpResponseType {
    body: {
        success: boolean;
        data: IGroupChannel | undefined;
        error: string;
    };
}

export default function makeCreateChannelController({
    createChannel,
}: ICreateChannelUseCase) {
    return async function createChannelController(
        httpRequest: IHttpRequest
    ): Promise<ICreateChannelResponse> {
        const headers: { [key: string]: string } = {
            "Content-Type": "application/json",
        };
        try {
            const addedChannel = await createChannel(
                httpRequest.body.channelInfo
            );
            return {
                headers,
                statusCode: 200,
                body: addedChannel,
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
