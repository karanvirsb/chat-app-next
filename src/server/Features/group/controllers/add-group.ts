import { IHttpRequest } from "../../../express-callback/index";
import { IGroup } from "../group";
import { IAddGroup } from "../use-cases/addGroup";

type IAddGroupResponse = ControllerReturn<IGroup>;

export default function makeAddGroupController({ addGroup }: IAddGroup) {
  return async function addGroupController(
    httpRequest: IHttpRequest
  ): Promise<IAddGroupResponse> {
    const headers: { [key: string]: string } = {
      "Content-Type": "application/json",
    };
    try {
      const addedGroup = await addGroup(
        httpRequest.body.groupInfo,
        httpRequest.body.userId
      );
      return {
        headers,
        statusCode: 200,
        body: addedGroup,
      };
    } catch (error: unknown) {
      console.log(
        "🚀 ~ file: add-group.ts:25 ~ makeAddGroupController ~ error:",
        error
      );

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
