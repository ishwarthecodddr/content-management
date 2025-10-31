import { connectToDb } from "@/lib/db";
import Link from "@/models/links";
import { NextResponse } from "next/server";

export async function GET() {
  await connectToDb();
  const links = await Link.find();
  return NextResponse.json(links);
}

export async function POST(req: Request) {
  await connectToDb();
  const { url } = await req.json();
  const link = await Link.create({ url });
  return NextResponse.json(link);
}
