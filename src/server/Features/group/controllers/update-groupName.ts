import {
    IHttpRequest,
    httpResponseType,
} from "../../../express-callback/index";
import { IGroup } from "../group";
import { IUpdateGroupName } from "../use-cases/updateGroupName";

interface IUpdateGroupNameResponse extends httpResponseType {
    body: {
        success: boolean;
        data: IGroup | undefined;
        error: string;
    };
}

export default function makeUpdateGroupNameController({
    updateGroupName,
}: IUpdateGroupName) {
    return async function updateGroupNameController(
        httpRequest: IHttpRequest
    ): Promise<IUpdateGroupNameResponse> {
        const headers: { [key: string]: string } = {
            "Content-Type": "application/json",
        };
        try {
            const updatedGroup = await updateGroupName(
                httpRequest.body.groupId,
                httpRequest.body.newGroupName
            );
            return {
                headers,
                statusCode: 200,
                body: updatedGroup,
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
