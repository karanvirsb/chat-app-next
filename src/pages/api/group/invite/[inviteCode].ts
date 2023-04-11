import { getGroupByInviteCode } from "@/server/Features/group/use-cases";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const headers: { [key: string]: string } = {
    "Content-Type": "application/json",
  };
  if (req.method === "GET") {
    await getGroupByInviteCodeRequest(req, res, headers);
  }
}

async function getGroupByInviteCodeRequest(
  req: NextApiRequest,
  res: NextApiResponse<any>,
  headers: { [key: string]: string }
) {
  try {
    const inviteCode = req.query.inviteCode as string;
    const foundGroup = await getGroupByInviteCode(inviteCode);
    res.json({
      headers,
      statusCode: 200,
      body: foundGroup,
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
