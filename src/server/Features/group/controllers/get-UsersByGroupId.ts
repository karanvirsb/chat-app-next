import {
    IHttpRequest,
    httpResponseType,
} from "../../../express-callback/index";
import { IGetUsersByGroupId } from "../use-cases/getUsersByGroupId";
import { user } from "../use-cases/getUsersByGroupId";

interface IGetUsersByGroupIdResponse extends httpResponseType {
    body: {
        success: boolean;
        data: user[] | undefined;
        error: string;
    };
}

export default function makeGetUsersByGroupIdController({
    getUsersByGroupId,
}: IGetUsersByGroupId) {
    return async function getUsersByGroupIdController(
        httpRequest: IHttpRequest
    ): Promise<IGetUsersByGroupIdResponse> {
        const headers: { [key: string]: string } = {
            "Content-Type": "application/json",
        };
        try {
            const foundUsers = await getUsersByGroupId(
                httpRequest.params.groupId
            );
            return {
                headers,
                statusCode: 200,
                body: foundUsers,
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
