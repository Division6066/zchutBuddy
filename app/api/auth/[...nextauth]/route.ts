import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return convexAuthNextjsToken(request);
}

export async function POST(request: NextRequest) {
  return convexAuthNextjsToken(request);
}

