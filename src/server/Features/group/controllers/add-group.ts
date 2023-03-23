import {
    IHttpRequest,
    httpResponseType,
} from "../../../express-callback/index";
import { IGroup } from "../group";
import { IAddGroup } from "../use-cases/addGroup";

interface IAddGroupResponse extends httpResponseType {
    body: {
        success: boolean;
        data: IGroup | undefined;
        error: string;
    };
}

export default function makeAddGroupController({ addGroup }: IAddGroup) {
    return async function addGroupController(
        httpRequest: IHttpRequest
    ): Promise<IAddGroupResponse> {
        const headers: { [key: string]: string } = {
            "Content-Type": "application/json",
        };
        try {
            const addedGroup = await addGroup(
                httpRequest.body.groupInfo,
                httpRequest.body.userId
            );
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
