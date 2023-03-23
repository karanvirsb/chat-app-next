import { IAddUserUseCase } from "./addUserUseCase";
import {
  IHttpRequest,
  httpResponseType,
} from "../../../express-callback/index";

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
