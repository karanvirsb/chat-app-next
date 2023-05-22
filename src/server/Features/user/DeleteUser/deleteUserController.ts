import {
  httpResponseType,
  IHttpRequest,
} from "../../../express-callback/index";
import { IDeleteUserUserCase } from "./deleteUserUseCase";

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
    } catch (error: unknown) {
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
