import { IGetUserUseCase } from "../use-cases/getUser";
import {
    IHttpRequest,
    httpResponseType,
} from "../../../express-callback/index";

export default function makeGetUser({ getUser }: IGetUserUseCase) {
    return async function getUserController(
        httpRequest: IHttpRequest
    ): Promise<httpResponseType> {
        const headers: { [key: string]: string } = {
            "Content-Type": "application/json",
        };

        try {
            const user = await getUser(httpRequest.params.id);
            return {
                headers,
                statusCode: 200,
                body: user,
            };
        } catch (error: any) {
            console.log(error);
            return {
                headers,
                statusCode: 400,
                body: {
                    success: false,
                    data: [],
                    error: error.message,
                },
            };
        }
    };
}
