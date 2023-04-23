import {
  httpResponseType,
  IHttpRequest,
} from "../../../express-callback/index";
import { user } from "../data-access/group-db";
import { IAddUserToGroup } from "../use-cases/addUserToGroup";

interface IAddUserToGroupResponse extends httpResponseType {
  body: {
    success: boolean;
    data: user | undefined;
    error: string;
  };
}

export default function makeAddUserToGroupController({
  addUserToGroup,
}: IAddUserToGroup) {
  return async function addUserToGroupController(
    httpRequest: IHttpRequest
  ): Promise<IAddUserToGroupResponse> {
    const headers: { [key: string]: string } = {
      "Content-Type": "application/json",
    };
    try {
      const addedUser = await addUserToGroup(
        httpRequest.body.groupId,
        httpRequest.body.userId
      );
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
          data: undefined,
          error: error.message,
        },
      };
    }
  };
}
