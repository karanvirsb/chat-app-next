import { IHttpRequest } from "../../../express-callback/index";
import { IGroupMessage } from "../groupMessage";
import { ICreateMessageUseCase } from "../use-cases/createMessage";

type ICreateMessageResponse = ControllerReturn<IGroupMessage>;

export default function makeCreateMessageController({
  createMessage,
}: ICreateMessageUseCase) {
  return async function createMessageController(
    httpRequest: IHttpRequest
  ): Promise<ICreateMessageResponse> {
    const headers: { [key: string]: string } = {
      "Content-Type": "application/json",
    };
    try {
      const newMessage: IGroupMessage = httpRequest.body.messageInfo;
      newMessage.dateCreated = new Date(
        httpRequest.body.messageInfo.dateCreated
      ).getTime();
      const createdMessage = await createMessage(newMessage);
      return {
        headers,
        statusCode: 200,
        body: createdMessage,
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
