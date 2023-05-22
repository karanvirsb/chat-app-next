import {
  httpResponseType,
  IHttpRequest,
} from "../../../express-callback/index";
import { Pagination } from "../../../Utilities/pagination/pagination";
import { returingPaginatedMessages } from "../data-access/message-db";
import { IGroupMessage } from "../groupMessage";
import { IGetMessagesByChannelIdUseCase } from "../use-cases/getMessagesByChannelId";

interface IGetMessagesByChannelIdResponse extends httpResponseType {
  body: {
    success: boolean;
    data:
      | undefined
      | {
          hasNextPage: boolean;
          nextPage: string | null;
          data: IGroupMessage[];
        };
    error: string;
  };
}

export default function makeGetMessagesByChannelIdController({
  getMessagesByChannelId,
}: IGetMessagesByChannelIdUseCase) {
  return async function getMessagesByChannelIdController(
    httpRequest: IHttpRequest
  ): Promise<IGetMessagesByChannelIdResponse> {
    const headers: { [key: string]: string } = {
      "Content-Type": "application/json",
    };
    try {
      const channelId: string = httpRequest.query.channelId as any;
      const dateCreated: string = httpRequest.query.dateCreated as any;
      const limit: string = httpRequest.query.limit as any;
      const foundMessages = await getMessagesByChannelId(
        channelId,
        new Date(dateCreated),
        parseInt(limit)
      );
      return {
        headers,
        statusCode: 200,
        body: foundMessages,
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
