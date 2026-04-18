import { NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";

export async function GET(req: Request) {
  try {
    const redirectUri = `${process.env.APP_URL}/api/auth/callback`;
    const client = new OAuth2Client(
      process.env.OAUTH_CLIENT_ID,
      process.env.OAUTH_CLIENT_SECRET,
      redirectUri
    );

    const authUrl = client.generateAuthUrl({
      access_type: "offline",
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
      ],
      prompt: "consent",
    });

    return NextResponse.json({ url: authUrl });
  } catch (error) {
    console.error("Auth URL generation error:", error);
    return NextResponse.json({ error: "Failed to generate URL" }, { status: 500 });
  }
}
