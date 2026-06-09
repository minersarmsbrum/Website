import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

export type SessionData = {
  role: "admin" | "staff";
  username: string;
};

export const sessionOptions = {
  cookieName: "miners_arms_session",
  password: process.env.SESSION_PASSWORD as string,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 8,
  },
};

// Centralised helper so the `as any` cast lives in one place
export async function getSession() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return getIronSession<SessionData>((await cookies()) as any, sessionOptions);
}
