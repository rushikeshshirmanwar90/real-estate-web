import connect from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    await connect();
  } catch (error) {}

  return NextResponse.json({
    message: "Hello, World!",
  });
};
