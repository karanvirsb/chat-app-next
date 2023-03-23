import {
    IHttpRequest,
    httpResponseType,
} from "../../../express-callback/index";
import { IGroup } from "../group";
import { IGetGroupByInviteCode } from "../use-cases/getGroupByInviteCode";

interface IGetGroupByInviteCodeResponse extends httpResponseType {
    body: {
        success: boolean;
        data: IGroup | undefined;
        error: string;
    };
}

export default function makeGetGroupByInviteCodeController({
    getGroupByInviteCode,
}: IGetGroupByInviteCode) {
    return async function getGroupByIdController(
        httpRequest: IHttpRequest
    ): Promise<IGetGroupByInviteCodeResponse> {
        const headers: { [key: string]: string } = {
            "Content-Type": "application/json",
        };
        try {
            const foundGroup = await getGroupByInviteCode(
                httpRequest.params.inviteCode
            );
            return {
                headers,
                statusCode: 200,
                body: foundGroup,
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
