import {
    IHttpRequest,
    httpResponseType,
} from "../../../express-callback/index";
import { IGroupChannel } from "../groupChannel";
import { IGetChannelsByGroupIdUseCase } from "../use-cases/getChannelsByGroupId";

interface IGetChannelsByGroupIdResponse extends httpResponseType {
    body: {
        success: boolean;
        data: IGroupChannel[] | undefined;
        error: string;
    };
}

export default function makeGetChannelsByGroupIdController({
    getChannelsByGroupId,
}: IGetChannelsByGroupIdUseCase) {
    return async function getChannelsByGroupIdController(
        httpRequest: IHttpRequest
    ): Promise<IGetChannelsByGroupIdResponse> {
        const headers: { [key: string]: string } = {
            "Content-Type": "application/json",
        };
        try {
            const foundChannels = await getChannelsByGroupId(
                httpRequest.params.groupId
            );
            return {
                headers,
                statusCode: 200,
                body: foundChannels,
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
