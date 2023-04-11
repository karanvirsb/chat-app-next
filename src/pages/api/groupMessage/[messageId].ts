import { getMessageById } from "@/server/Features/groupMessage/use-cases";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const headers: { [key: string]: string } = {
    "Content-Type": "application/json",
  };
  if (req.method?.toUpperCase() === "GET") {
    await getGroupMessage(req, res, headers);
  }
}

async function getGroupMessage(
  req: NextApiRequest,
  res: NextApiResponse<any>,
  headers: { [key: string]: string }
) {
  try {
    const messageId = req.query.messageId as string;
    const foundMessage = await getMessageById(messageId);
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
