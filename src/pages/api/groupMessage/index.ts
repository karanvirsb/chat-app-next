import { IGroupMessage } from "@/server/Features/groupMessage/groupMessage";
import { createMessage } from "@/server/Features/groupMessage/use-cases";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const headers: { [key: string]: string } = {
    "Content-Type": "application/json",
  };

  if (req.method?.toUpperCase() === "POST") {
    await createGroupMessage(req, res, headers);
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
    const foundMessage = await createMessage(newMessage);
    res.json({
      headers,
      statusCode: 200,
      body: foundMessage,
    });
  } catch (error: any) {
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
