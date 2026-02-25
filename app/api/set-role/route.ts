import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { role } = await req.json();

  const cookieStore = await cookies();
  cookieStore.set("role", role, {
    httpOnly: true,
    path: "/",
  });

  return NextResponse.json({ success: true });
}