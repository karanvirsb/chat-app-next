import { IDeleteUserUserCase } from "./deleteUserUseCase";
import {
  IHttpRequest,
  httpResponseType,
} from "../../../express-callback/index";

export default function makeDeleteUserController({
  deleteUser,
}: IDeleteUserUserCase) {
  return async function deleteUserController(
    httpRequest: IHttpRequest
  ): Promise<httpResponseType> {
    const headers: { [key: string]: string } = {
      "Content-Type": "application/json",
    };

    try {
      const deletedUser = await deleteUser(httpRequest.body.id);
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
          data: [],
          error: error.message,
        },
      };
    }
  };
}
