import {
    IHttpRequest,
    httpResponseType,
} from "../../../express-callback/index";
import { IFriends } from "../friends";
import { IAddFriendsUseCase } from "../use-cases/addFriend";

interface IAddFriendResponse extends httpResponseType {
    body: {
        success: boolean;
        data: IFriends | undefined;
        error: string;
    };
}

export default function makeAddFriendController({
    addFriend,
}: IAddFriendsUseCase) {
    return async function addFriendController(
        httpRequest: IHttpRequest
    ): Promise<IAddFriendResponse> {
        const headers: { [key: string]: string } = {
            "Content-Type": "application/json",
        };
        try {
            const addedFriend = await addFriend(
                httpRequest.body.userId,
                httpRequest.body.friendId
            );
            return {
                headers,
                statusCode: 200,
                body: addedFriend,
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
