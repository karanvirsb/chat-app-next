import {
    IHttpRequest,
    httpResponseType,
} from "../../../express-callback/index";
import { IGroupChannel } from "../groupChannel";
import { IUpdateChannelNameUseCase } from "../use-cases/updateChannelName";

interface IUpdateChannelNameResponse extends httpResponseType {
    body: {
        success: boolean;
        data: IGroupChannel | undefined;
        error: string;
    };
}

export default function makeUpdateChannelNameController({
    updateChannelName,
}: IUpdateChannelNameUseCase) {
    return async function updateChannelNameController(
        httpRequest: IHttpRequest
    ): Promise<IUpdateChannelNameResponse> {
        const headers: { [key: string]: string } = {
            "Content-Type": "application/json",
        };
        try {
            const updatedChannel = await updateChannelName(
                httpRequest.body.channelId,
                httpRequest.body.newName
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
