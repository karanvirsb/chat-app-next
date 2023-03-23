import {
    IHttpRequest,
    httpResponseType,
} from "../../../express-callback/index";
import { IFriends } from "../friends";
import { IGetFriendsUseCase } from "../use-cases/getFriends";

interface IGetFriendsResponse extends httpResponseType {
    body: {
        success: boolean;
        data: IFriends[] | undefined;
        error: string;
    };
}

export default function makeGetFriendsController({
    getFriends,
}: IGetFriendsUseCase) {
    return async function getFriendsController(
        httpRequest: IHttpRequest
    ): Promise<IGetFriendsResponse> {
        const headers: { [key: string]: string } = {
            "Content-Type": "application/json",
        };
        try {
            const foundFriends = await getFriends(httpRequest.params.userId);
            return {
                headers,
                statusCode: 200,
                body: foundFriends,
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
