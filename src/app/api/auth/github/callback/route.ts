import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import qs from "querystring";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  const CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
  const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

  try {
    const params = qs.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
    });

    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      params,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );


    const accessToken = tokenResponse.data.access_token;
    if (!accessToken) {
      console.error("No access token in response:", tokenResponse.data);
      return NextResponse.json({ error: "Failed to get access token" }, { status: 400 });
    }

    return NextResponse.redirect(`https://vexon-ai.vercel.app/create?token=${accessToken}`);
  } catch (error: any) {
    console.error("OAuth error details:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
    });
    return NextResponse.json({ 
      error: "Failed to get access token",
      details: error.response?.data || error.message 
    }, { status: 500 });
  }
}
