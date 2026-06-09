import { NextResponse } from "next/server";
import { store } from "@/lib/store";

// Public endpoint — used by the public menu page so admin edits are reflected live
export async function GET() {
  return NextResponse.json(store.menu.list());
}
