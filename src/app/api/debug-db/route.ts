import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const userCount = await prisma.user.count();
    const users = await prisma.user.findMany({
      select: { username: true, role: true },
      take: 5
    });

    return NextResponse.json({
      status: "online",
      database: "connected",
      userCount,
      sampleUsers: users,
      env: process.env.NODE_ENV
    });
  } catch (error: any) {
    return NextResponse.json({
      status: "error",
      message: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
