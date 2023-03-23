import {
    IHttpRequest,
    httpResponseType,
} from "../../../express-callback/index";
import { IGroup } from "../group";
import { IUpdateInviteCode } from "../use-cases/updateInviteCode";

interface IUpdateInviteCodeResponse extends httpResponseType {
    body: {
        success: boolean;
        data: IGroup | undefined;
        error: string;
    };
}

export default function makeUpdateInviteCodeController({
    updateInviteCode,
}: IUpdateInviteCode) {
    return async function updateInviteCodeController(
        httpRequest: IHttpRequest
    ): Promise<IUpdateInviteCodeResponse> {
        const headers: { [key: string]: string } = {
            "Content-Type": "application/json",
        };
        try {
            const updatedGroup = await updateInviteCode(
                httpRequest.body.groupId
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
