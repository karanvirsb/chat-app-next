import {
    IHttpRequest,
    httpResponseType,
} from "../../../express-callback/index";
import { IGroup } from "../group";
import { IDeleteGroup } from "../use-cases/deleteGroup";

interface IDeleteGroupResponse extends httpResponseType {
    body: {
        success: boolean;
        data: IGroup | undefined;
        error: string;
    };
}

export default function makeDeleteGroupController({
    deleteGroup,
}: IDeleteGroup) {
    return async function deleteGroupController(
        httpRequest: IHttpRequest
    ): Promise<IDeleteGroupResponse> {
        const headers: { [key: string]: string } = {
            "Content-Type": "application/json",
        };
        try {
            const addedGroup = await deleteGroup(httpRequest.body.groupId);
            return {
                headers,
                statusCode: 200,
                body: addedGroup,
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
