import { IHttpRequest } from "../../../express-callback/index";
import { IGroup } from "../group";
import { IDeleteGroup } from "../use-cases/deleteGroup";

type IDeleteGroupResponse = ControllerReturn<IGroup>;

export default function makeDeleteGroupController({
  deleteGroup,
}: IDeleteGroup) {
  return async function deleteGroupController(
    httpRequest: IHttpRequest
  ): Promise<IDeleteGroupResponse> {
    const headers: { [key: string]: string } = {
      "Content-Type": "application/json",
    };
    try {
      const addedGroup = await deleteGroup(httpRequest.body.groupId);
      return {
        headers,
        statusCode: 200,
        body: addedGroup,
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
