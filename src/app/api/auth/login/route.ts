import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { validateCredentials } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json({ error: "Username and password required" }, { status: 400 });
  }

  const role = validateCredentials(String(username).trim(), String(password));

  if (!role) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const session = await getSession();
  session.role = role;
  session.username = String(username).trim();
  await session.save();

  return NextResponse.json({ role });
}
