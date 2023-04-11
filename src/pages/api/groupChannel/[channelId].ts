import { getChannelById } from "@/server/Features/groupChannel/use-cases";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const headers: { [key: string]: string } = {
    "Content-Type": "application/json",
  };
  if (req.method?.toUpperCase() === "GET") {
    await getChannelRequest(req, res, headers);
  }
}

async function getChannelRequest(
  req: NextApiRequest,
  res: NextApiResponse<any>,
  headers: { [key: string]: string }
) {
  try {
    const channelId = req.query.channelId as string;
    const foundChannel = await getChannelById(channelId);
    res.json({
      headers,
      statusCode: 200,
      body: foundChannel,
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
