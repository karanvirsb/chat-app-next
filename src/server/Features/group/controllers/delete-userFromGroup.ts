import {
    IHttpRequest,
    httpResponseType,
} from "../../../express-callback/index";
import { IRemoveUserFromGroup } from "../use-cases/removeUserFromGroup";
import { groupUsers } from "../data-access/group-db";

interface IDeleteUserFromGroupResponse extends httpResponseType {
    body: {
        success: boolean;
        data: groupUsers | undefined;
        error: string;
    };
}

export default function makeDeleteUserFromGroupController({
    removeUserFromGroup,
}: IRemoveUserFromGroup) {
    return async function deleteUserFromGroupController(
        httpRequest: IHttpRequest
    ): Promise<IDeleteUserFromGroupResponse> {
        const headers: { [key: string]: string } = {
            "Content-Type": "application/json",
        };
        try {
            const deletedUser = await removeUserFromGroup(
                httpRequest.body.groupId,
                httpRequest.body.userId
            );
            return {
                headers,
                statusCode: 200,
                body: deletedUser,
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
