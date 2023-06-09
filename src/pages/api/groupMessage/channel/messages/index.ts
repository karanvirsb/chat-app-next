import { NextApiRequest, NextApiResponse } from "next";

import { getMessagesByChannelId } from "@/server/Features/groupMessage/use-cases";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const headers: { [key: string]: string } = {
    "Content-Type": "application/json",
  };

  if (req.method?.toUpperCase() === "GET") {
    await getGroupMessages(req, res, headers);
  }
}

async function getGroupMessages(
  req: NextApiRequest,
  res: NextApiResponse,
  headers: { [key: string]: string }
) {
  try {
    const channelId: string = req.query.channelId as any;
    const dateCreated: string = req.query.dateCreated as any;
    const limit: string = req.query.limit as any;
    const foundMessages = await getMessagesByChannelId(
      channelId,
      parseInt(dateCreated),
      parseInt(limit)
    );
    res.json({
      headers,
      statusCode: 200,
      body: foundMessages,
    });
  } catch (error: unknown) {
    res.json({
      headers,
      statusCode: 400,
      body: {
        success: false,
        data: undefined,
        error: error,
      },
    });
  }
}
