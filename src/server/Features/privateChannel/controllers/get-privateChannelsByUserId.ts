import {
    IHttpRequest,
    httpResponseType,
} from "../../../express-callback/index";
import { IPrivateChannel } from "../privateChannel";
import { IGetPrivateChannelsByUserIdUseCase } from "../use-cases/getPrivateChannelsByUserId";

interface IGetChannelsByUserIdResponse extends httpResponseType {
    body: {
        success: boolean;
        data: IPrivateChannel[] | undefined;
        error: string;
    };
}

export default function makeGetPrivateChannelsByUserIdController({
    getPrivateChannelsByUserId,
}: IGetPrivateChannelsByUserIdUseCase) {
    return async function getChannelsByUserIdController(
        httpRequest: IHttpRequest
    ): Promise<IGetChannelsByUserIdResponse> {
        const headers: { [key: string]: string } = {
            "Content-Type": "application/json",
        };
        try {
            const foundChannels = await getPrivateChannelsByUserId(
                httpRequest.params.userId
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
