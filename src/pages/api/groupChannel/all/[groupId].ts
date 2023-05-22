import { NextApiRequest, NextApiResponse } from "next";

import { getChannelsByGroupId } from "@/server/Features/groupChannel/use-cases";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const headers: { [key: string]: string } = {
    "Content-Type": "application/json",
  };
  if (req.method?.toUpperCase() === "GET") {
    await getChannelsByGroupIdRequest(req, res, headers);
  }
}

async function getChannelsByGroupIdRequest(
  req: NextApiRequest,
  res: NextApiResponse<any>,
  headers: { [key: string]: string }
) {
  try {
    const groupId = req.query.groupId as string;
    const foundChannels = await getChannelsByGroupId(groupId);
    res.json({
      headers,
      statusCode: 200,
      body: foundChannels,
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
