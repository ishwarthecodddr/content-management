import { connectToDb } from "@/lib/db";
import Link from "@/models/links";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDb();
    await Link.findByIdAndDelete(id);
    return NextResponse.json({ message: "Link Deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting Link" });
  }
}
