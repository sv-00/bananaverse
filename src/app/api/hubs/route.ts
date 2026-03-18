import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import type { Hub } from "@/types/logistics";

// GET all hubs
export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const { searchParams } = new URL(request.url);
    
    const type = searchParams.get("type");
    const active = searchParams.get("active");

    const filter: Record<string, unknown> = {};
    if (type) filter.type = type;
    if (active !== null) filter.isActive = active === "true";

    const hubs = await db
      .collection<Hub>("hubs")
      .find(filter)
      .sort({ name: 1 })
      .toArray();

    return NextResponse.json({ hubs });
  } catch (error) {
    console.error("Failed to fetch hubs:", error);
    return NextResponse.json({ error: "Failed to fetch hubs" }, { status: 500 });
  }
}

// POST create new hub
export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const body = await request.json();

    const hub: Omit<Hub, "_id"> = {
      name: body.name,
      code: body.code,
      type: body.type,
      location: body.location,
      capacity: body.capacity || { totalSlots: 1000, usedSlots: 0, maxWeight: 50000 },
      operatingHours: body.operatingHours || {},
      manager: body.manager,
      serviceZones: body.serviceZones || [],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("hubs").insertOne(hub);

    return NextResponse.json({
      id: result.insertedId.toString(),
      ...hub,
    }, { status: 201 });
  } catch (error) {
    console.error("Failed to create hub:", error);
    return NextResponse.json({ error: "Failed to create hub" }, { status: 500 });
  }
}
