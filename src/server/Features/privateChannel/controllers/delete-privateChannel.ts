import {
    IHttpRequest,
    httpResponseType,
} from "../../../express-callback/index";
import { IPrivateChannel } from "../privateChannel";
import { IDeletePrivateChannelUseCase } from "../use-cases/deletePrivateChannel";

interface IDeletePrivateChannelResponse extends httpResponseType {
    body: {
        success: boolean;
        data: IPrivateChannel | undefined;
        error: string;
    };
}

export default function makeDeletePrivateChannelController({
    deletePrivateChannel,
}: IDeletePrivateChannelUseCase) {
    return async function deletePrivateChannelController(
        httpRequest: IHttpRequest
    ): Promise<IDeletePrivateChannelResponse> {
        const headers: { [key: string]: string } = {
            "Content-Type": "application/json",
        };
        try {
            const deletedChannel = await deletePrivateChannel(
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
