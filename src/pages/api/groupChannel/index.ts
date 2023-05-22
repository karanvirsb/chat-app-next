import { NextApiRequest, NextApiResponse } from "next";

import { IGroupChannel } from "@/server/Features/groupChannel/groupChannel";
import { createChannel } from "@/server/Features/groupChannel/use-cases";
import id from "@/server/Utilities/id";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const headers: { [key: string]: string } = {
    "Content-Type": "application/json",
  };
  if (req.method?.toUpperCase() === "POST") {
    await createChannelRequest(req, res, headers);
  }
}

async function createChannelRequest(
  req: NextApiRequest,
  res: NextApiResponse<any>,
  headers: { [key: string]: string }
) {
  try {
    const { channelInfo }: { channelInfo: IGroupChannel } = req.body;
    console.log(channelInfo);
    const createdChannel = await createChannel({
      channelId: channelInfo.channelId ?? id.makeId(),
      channelName: channelInfo.channelName,
      dateCreated: channelInfo.dateCreated ?? new Date(),
      groupId: channelInfo.groupId,
    });
    console.log(createdChannel);
    res.json({
      headers,
      statusCode: 200,
      body: createdChannel,
    });
  } catch (error: unknown) {
    res.json({
      headers,
      statusCode: 400,
      body: {
        success: false,
        data: undefined,
        error,
      },
    });
  }
}
