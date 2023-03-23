import {
    IHttpRequest,
    httpResponseType,
} from "../../../express-callback/index";
import { IFriends } from "../friends";
import { IGetAFriendUseCase } from "../use-cases/getAFriend";

interface IGetAFriendResponse extends httpResponseType {
    body: {
        success: boolean;
        data: IFriends | undefined;
        error: string;
    };
}

export default function makeGetAFriendController({
    getAFriend,
}: IGetAFriendUseCase) {
    return async function getAFriendController(
        httpRequest: IHttpRequest
    ): Promise<IGetAFriendResponse> {
        const headers: { [key: string]: string } = {
            "Content-Type": "application/json",
        };
        try {
            const foundFriend = await getAFriend(
                httpRequest.params.userId,
                httpRequest.params.friendId
            );
            return {
                headers,
                statusCode: 200,
                body: foundFriend,
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
