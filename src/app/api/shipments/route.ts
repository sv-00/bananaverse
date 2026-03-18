import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import type { Shipment } from "@/types/logistics";

// GET all shipments with filtering
export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const { searchParams } = new URL(request.url);
    
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const driverId = searchParams.get("driverId");
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = parseInt(searchParams.get("skip") || "0");

    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (driverId) filter.assignedDriverId = driverId;

    const shipments = await db
      .collection<Shipment>("shipments")
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await db.collection("shipments").countDocuments(filter);

    return NextResponse.json({ shipments, total, limit, skip });
  } catch (error) {
    console.error("Failed to fetch shipments:", error);
    return NextResponse.json({ error: "Failed to fetch shipments" }, { status: 500 });
  }
}

// POST create new shipment
export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const body = await request.json();

    // Generate tracking ID
    const count = await db.collection("shipments").countDocuments();
    const trackingId = `BV-${new Date().getFullYear()}-${String(count + 1).padStart(4, "0")}`;

    const shipment: Omit<Shipment, "_id"> = {
      trackingId,
      status: "pending",
      origin: body.origin,
      destination: body.destination,
      sender: body.sender,
      recipient: body.recipient,
      package: body.package,
      priority: body.priority || "standard",
      pickupWindow: body.pickupWindow,
      deliveryWindow: body.deliveryWindow,
      notes: body.notes,
      tags: body.tags || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("shipments").insertOne(shipment);

    return NextResponse.json({
      id: result.insertedId.toString(),
      ...shipment,
    }, { status: 201 });
  } catch (error) {
    console.error("Failed to create shipment:", error);
    return NextResponse.json({ error: "Failed to create shipment" }, { status: 500 });
  }
}
