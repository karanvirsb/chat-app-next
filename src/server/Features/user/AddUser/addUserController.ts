import {
  httpResponseType,
  IHttpRequest,
} from "../../../express-callback/index";
import { IAddUserUseCase } from "./addUserUseCase";

export default function makePostUser({ addUser }: IAddUserUseCase) {
  return async function addUserController(
    httpRequest: IHttpRequest
  ): Promise<httpResponseType> {
    const headers: { [key: string]: string } = {
      "Content-Type": "application/json",
    };

    try {
      const addedUser = await addUser(httpRequest.body.userInfo);
      return {
        headers,
        statusCode: 200,
        body: addedUser,
      };
    } catch (error: unknown) {
      console.log(error);
      return {
        headers,
        statusCode: 400,
        body: {
          success: false,
          data: [],
          error,
        },
      };
    }
  };
}
