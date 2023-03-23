import {
    IHttpRequest,
    httpResponseType,
} from "../../../express-callback/index";
import { IFriends } from "../friends";
import { IDeleteFriendsUseCase } from "../use-cases/deleteFriend";

interface IDeleteFriendResponse extends httpResponseType {
    body: {
        success: boolean;
        data: IFriends | undefined;
        error: string;
    };
}

export default function makeDeleteFriendController({
    deleteFriend,
}: IDeleteFriendsUseCase) {
    return async function deleteFriendController(
        httpRequest: IHttpRequest
    ): Promise<IDeleteFriendResponse> {
        const headers: { [key: string]: string } = {
            "Content-Type": "application/json",
        };
        try {
            const deletedFriend = await deleteFriend(
                httpRequest.body.userId,
                httpRequest.body.friendId
            );
            return {
                headers,
                statusCode: 200,
                body: deletedFriend,
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
