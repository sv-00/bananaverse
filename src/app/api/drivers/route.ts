import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import type { Driver } from "@/types/logistics";

// GET all drivers
export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const { searchParams } = new URL(request.url);
    
    const status = searchParams.get("status");
    const zone = searchParams.get("zone");

    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    if (zone) filter.zones = zone;

    const drivers = await db
      .collection<Driver>("drivers")
      .find(filter)
      .sort({ "metrics.totalDeliveries": -1 })
      .toArray();

    return NextResponse.json({ drivers });
  } catch (error) {
    console.error("Failed to fetch drivers:", error);
    return NextResponse.json({ error: "Failed to fetch drivers" }, { status: 500 });
  }
}

// POST create new driver
export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const body = await request.json();

    const driver: Omit<Driver, "_id"> = {
      userId: body.userId,
      name: body.name,
      phone: body.phone,
      email: body.email,
      image: body.image,
      license: body.license,
      status: "offline",
      activeShipmentIds: [],
      metrics: {
        totalDeliveries: 0,
        successfulDeliveries: 0,
        failedDeliveries: 0,
        averageRating: 0,
        totalRatings: 0,
        onTimePercentage: 0,
      },
      vehicleTypes: body.vehicleTypes || ["van"],
      zones: body.zones || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("drivers").insertOne(driver);

    return NextResponse.json({
      id: result.insertedId.toString(),
      ...driver,
    }, { status: 201 });
  } catch (error) {
    console.error("Failed to create driver:", error);
    return NextResponse.json({ error: "Failed to create driver" }, { status: 500 });
  }
}
