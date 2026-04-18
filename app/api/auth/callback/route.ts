import { NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { cookies } from "next/headers";
import { encrypt } from "@/lib/auth";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return new NextResponse("Missing code", { status: 400 });
  }

  try {
    const redirectUri = `${process.env.APP_URL}/api/auth/callback`;
    const client = new OAuth2Client(
      process.env.OAUTH_CLIENT_ID,
      process.env.OAUTH_CLIENT_SECRET,
      redirectUri
    );

    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    // Get user info
    const res = await client.request({ url: "https://www.googleapis.com/oauth2/v3/userinfo" });
    const user = res.data as any;

    const isAdmin = user.email === "creativevibes5media@gmail.com";

    const payload = {
      sub: user.sub,
      email: user.email,
      name: user.name,
      picture: user.picture,
      role: isAdmin ? "admin" : "user",
      // For non-admins, set a 30-day trial. 
      // NOTE: Without a database, this resets on every login. When deploying to Netlify, 
      // you will want to store the initial signup date in a DB (like Supabase or MongoDB).
      trialEndsAt: isAdmin ? null : Date.now() + 30 * 24 * 60 * 60 * 1000, 
    };

    const session = await encrypt(payload);

    const cookieStore = await cookies();
    cookieStore.set("session", session, {
       httpOnly: true,
       secure: true,
       sameSite: "none",
       path: "/",
       maxAge: 3600 * 10
    });

    // Send success message to parent window and close popup
    const html = `
      <html>
        <body>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS' }, '*');
              window.close();
            } else {
              window.location.href = '/';
            }
          </script>
          <p>Authentication successful. This window should close automatically.</p>
        </body>
      </html>
    `;

    return new NextResponse(html, { headers: { "Content-Type": "text/html" } });
  } catch (error) {
    console.error("Callback error:", error);
    return new NextResponse("Authentication failed", { status: 500 });
  }
}
