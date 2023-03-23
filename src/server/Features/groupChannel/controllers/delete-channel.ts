import {
    IHttpRequest,
    httpResponseType,
} from "../../../express-callback/index";
import { IGroupChannel } from "../groupChannel";
import { IDeleteChannelUseCase } from "../use-cases/deleteChannel";

interface IDeleteChannelResponse extends httpResponseType {
    body: {
        success: boolean;
        data: IGroupChannel | undefined;
        error: string;
    };
}

export default function makeDeleteChannelController({
    deleteChannel,
}: IDeleteChannelUseCase) {
    return async function deleteChannelController(
        httpRequest: IHttpRequest
    ): Promise<IDeleteChannelResponse> {
        const headers: { [key: string]: string } = {
            "Content-Type": "application/json",
        };
        try {
            const deletedChannel = await deleteChannel(
                httpRequest.body.channelId
            );
            return {
                headers,
                statusCode: 200,
                body: deletedChannel,
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
