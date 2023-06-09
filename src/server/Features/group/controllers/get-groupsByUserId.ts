import {
  httpResponseType,
  IHttpRequest,
} from "../../../express-callback/index";
import { IGroup } from "../group";
import { IGetGroupByInviteCode } from "../use-cases/getGroupByInviteCode";
import { IGetGroupsByUserId } from "../use-cases/getGroupsByUserId";

interface IGetGroupsByUserIdResponse extends httpResponseType {
  body: {
    success: boolean;
    data: IGroup[] | undefined;
    error: string;
  };
}

export default function makeGetGroupsByUserIdController({
  getGroupsByUserId,
}: IGetGroupsByUserId) {
  return async function getGroupsByUserIdController(
    httpRequest: IHttpRequest
  ): Promise<IGetGroupsByUserIdResponse> {
    const headers: { [key: string]: string } = {
      "Content-Type": "application/json",
    };
    try {
      const foundGroups = await getGroupsByUserId(httpRequest.params.userId);
      return {
        headers,
        statusCode: 200,
        body: foundGroups,
      };
    } catch (error: unknown) {
      console.log(error);
      return {
        headers,
        statusCode: 400,
        body: {
          success: false,
          data: undefined,
          error,
        },
      };
    }
  };
}
