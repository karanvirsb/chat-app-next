import {
    IHttpRequest,
    httpResponseType,
} from "../../../express-callback/index";
import { IPrivateChannel } from "../privateChannel";
import { ICreatePrivateChannelUseCase } from "../use-cases/createPrivateChannel";

interface ICreatePrivateChannelResponse extends httpResponseType {
    body: {
        success: boolean;
        data: IPrivateChannel | undefined;
        error: string;
    };
}

export default function makeCreatePrivateChannelController({
    createPrivateChannel,
}: ICreatePrivateChannelUseCase) {
    return async function createPrivateChannelController(
        httpRequest: IHttpRequest
    ): Promise<ICreatePrivateChannelResponse> {
        const headers: { [key: string]: string } = {
            "Content-Type": "application/json",
        };
        try {
            const addedChannel = await createPrivateChannel(
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
