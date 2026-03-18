import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import type { Vehicle } from "@/types/logistics";

// GET all vehicles
export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const { searchParams } = new URL(request.url);
    
    const status = searchParams.get("status");
    const type = searchParams.get("type");

    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    if (type) filter.type = type;

    const vehicles = await db
      .collection<Vehicle>("vehicles")
      .find(filter)
      .sort({ registrationNumber: 1 })
      .toArray();

    return NextResponse.json({ vehicles });
  } catch (error) {
    console.error("Failed to fetch vehicles:", error);
    return NextResponse.json({ error: "Failed to fetch vehicles" }, { status: 500 });
  }
}

// POST create new vehicle
export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const body = await request.json();

    const vehicle: Omit<Vehicle, "_id"> = {
      registrationNumber: body.registrationNumber,
      type: body.type,
      make: body.make,
      model: body.model,
      year: body.year,
      status: "available",
      capacity: body.capacity,
      maintenance: {
        lastService: new Date(),
        nextServiceDue: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        odometerReading: body.odometerReading || 0,
      },
      features: body.features || {
        refrigerated: false,
        liftGate: false,
        gps: true,
        dashcam: false,
      },
      insurance: body.insurance,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("vehicles").insertOne(vehicle);

    return NextResponse.json({
      id: result.insertedId.toString(),
      ...vehicle,
    }, { status: 201 });
  } catch (error) {
    console.error("Failed to create vehicle:", error);
    return NextResponse.json({ error: "Failed to create vehicle" }, { status: 500 });
  }
}
