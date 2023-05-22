import { NextApiRequest, NextApiResponse } from "next";

import { IGroupMessage } from "@/server/Features/groupMessage/groupMessage";
import { updateGroupMessageUC } from "@/server/Features/groupMessage/updateMessage";
import {
  createMessage,
  deleteMessage,
} from "@/server/Features/groupMessage/use-cases";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const headers: { [key: string]: string } = {
    "Content-Type": "application/json",
  };

  if (req.method?.toUpperCase() === "POST") {
    await createGroupMessage(req, res, headers);
  } else if (req.method?.toUpperCase() === "DELETE") {
    await deleteGroupMessage(req, res, headers);
  } else if (req.method?.toUpperCase() === "PUT") {
    // TODO add put
    await updateGroupMessage(req, res, headers);
  }
}

async function createGroupMessage(
  req: NextApiRequest,
  res: NextApiResponse<any>,
  headers: { [key: string]: string }
) {
  try {
    const newMessage: IGroupMessage = req.body.messageInfo;
    newMessage.dateCreated = new Date(req.body.messageInfo.dateCreated);
    const createdMessage = await createMessage(newMessage);
    res.json({
      headers,
      statusCode: 200,
      body: createdMessage,
    });
  } catch (error: unknown) {
    res.json({
      headers,
      statusCode: 400,
      body: {
        success: false,
        data: undefined,
        error: error.message,
      },
    });
  }
}

async function deleteGroupMessage(
  req: NextApiRequest,
  res: NextApiResponse<any>,
  headers: { [key: string]: string }
) {
  try {
    const messageId: IGroupMessage["messageId"] = req.body.messageId;
    const deletedMessage = await deleteMessage(messageId);
    res.json({
      headers,
      statusCode: 200,
      body: deletedMessage,
    });
  } catch (error: unknown) {
    res.json({
      headers,
      statusCode: 400,
      body: {
        success: false,
        data: undefined,
        error: error.message,
      },
    });
  }
}
async function updateGroupMessage(
  req: NextApiRequest,
  res: NextApiResponse<any>,
  headers: { [key: string]: string }
) {
  try {
    const { messageId, updates } = req.body;

    const updatedMessage = await updateGroupMessageUC({ messageId, updates });
    res.json({
      headers,
      statusCode: 200,
      body: updatedMessage,
    });
  } catch (error: unknown) {
    res.json({
      headers,
      statusCode: 400,
      body: {
        success: false,
        data: undefined,
        error: error.message,
      },
    });
  }
}
