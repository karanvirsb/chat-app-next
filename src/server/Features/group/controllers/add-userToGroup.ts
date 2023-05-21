import { IHttpRequest } from "../../../express-callback/index";
import { IGroup } from "../group";
import { IAddUserToGroup } from "../use-cases/addUserToGroup";

type IAddUserToGroupResponse = ControllerReturn<IGroup>;

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
    } catch (error: unknown) {
      console.log(error);
      return {
        headers,
        statusCode: 400,
        body: {
          success: false,
          error: error,
        },
      };
    }
  };
}
