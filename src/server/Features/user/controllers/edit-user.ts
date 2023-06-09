import {
  httpResponseType,
  IHttpRequest,
} from "../../../express-callback/index";
import { IEditUserUseCase } from "../use-cases/editUser";

export default function makeEditUser({ editUser }: IEditUserUseCase) {
  return async function editUserController(
    httpRequest: IHttpRequest
  ): Promise<httpResponseType> {
    const headers: { [key: string]: string } = {
      "Content-Type": "application/json",
    };

    try {
      const edittedUser = await editUser({
        userId: httpRequest.body.id,
        updates: httpRequest.body.updates,
      });
      return {
        headers,
        statusCode: 200,
        body: edittedUser,
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
