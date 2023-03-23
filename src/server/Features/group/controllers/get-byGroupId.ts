import {
    IHttpRequest,
    httpResponseType,
} from "../../../express-callback/index";
import { IGroup } from "../group";
import { IGetGroupById } from "../use-cases/getGroupbyId";

interface IGetGroupByIdResponse extends httpResponseType {
    body: {
        success: boolean;
        data: IGroup | undefined;
        error: string;
    };
}

export default function makeGetGroupByIdController({
    getGroupById,
}: IGetGroupById) {
    return async function getGroupByIdController(
        httpRequest: IHttpRequest
    ): Promise<IGetGroupByIdResponse> {
        const headers: { [key: string]: string } = {
            "Content-Type": "application/json",
        };
        try {
            const foundGroup = await getGroupById(httpRequest.params.groupId);
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
