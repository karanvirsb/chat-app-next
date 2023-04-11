import {
  createChannel,
  deleteChannel,
  getChannelById,
} from "@/server/Features/groupChannel/use-cases";
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
  } else if (req.method?.toUpperCase() === "POST") {
    await createChannelRequest(req, res, headers);
  } else if (req.method?.toUpperCase() === "DELETE") {
    await deleteChannelRequest(req, res, headers);
  } else if (req.method?.toUpperCase() === "PUT") {
    // TODO add updating feature
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

async function createChannelRequest(
  req: NextApiRequest,
  res: NextApiResponse<any>,
  headers: { [key: string]: string }
) {
  try {
    const channelId = req.query.channelId as string;
    const { channelName, groupId, dateCreated } = req.body;
    const createdChannel = await createChannel({
      channelId,
      channelName,
      dateCreated,
      groupId,
    });
    res.json({
      headers,
      statusCode: 200,
      body: createdChannel,
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

async function deleteChannelRequest(
  req: NextApiRequest,
  res: NextApiResponse<any>,
  headers: { [key: string]: string }
) {
  try {
    const channelId = req.query.channelId as string;
    const deletedChannel = await deleteChannel(channelId);
    res.json({
      headers,
      statusCode: 200,
      body: deletedChannel,
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
