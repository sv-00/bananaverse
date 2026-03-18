import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import type { Shipment, TrackingEvent } from "@/types/logistics";

// GET single shipment
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { db } = await connectToDatabase();

    // Check if it's a tracking ID or ObjectId
    const isObjectId = ObjectId.isValid(id);
    const filter = isObjectId
      ? { _id: new ObjectId(id) }
      : { trackingId: id };

    const shipment = await db.collection<Shipment>("shipments").findOne(filter);

    if (!shipment) {
      return NextResponse.json({ error: "Shipment not found" }, { status: 404 });
    }

    // Get tracking events
    const events = await db
      .collection<TrackingEvent>("tracking_events")
      .find({ shipmentId: shipment._id?.toString() })
      .sort({ timestamp: -1 })
      .toArray();

    return NextResponse.json({ shipment, events });
  } catch (error) {
    console.error("Failed to fetch shipment:", error);
    return NextResponse.json({ error: "Failed to fetch shipment" }, { status: 500 });
  }
}

// PUT update shipment
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { db } = await connectToDatabase();
    const updates = await request.json();

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid shipment ID" }, { status: 400 });
    }

    const oldShipment = await db.collection<Shipment>("shipments").findOne({ _id: new ObjectId(id) });
    
    const result = await db.collection("shipments").updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updates, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Shipment not found" }, { status: 404 });
    }

    // Create tracking event if status changed
    if (updates.status && oldShipment && updates.status !== oldShipment.status) {
      await db.collection("tracking_events").insertOne({
        shipmentId: id,
        status: updates.status,
        description: `Status changed to ${updates.status}`,
        actorType: "system",
        timestamp: new Date(),
      });
    }

    const shipment = await db.collection<Shipment>("shipments").findOne({ _id: new ObjectId(id) });
    return NextResponse.json(shipment);
  } catch (error) {
    console.error("Failed to update shipment:", error);
    return NextResponse.json({ error: "Failed to update shipment" }, { status: 500 });
  }
}

// DELETE shipment
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { db } = await connectToDatabase();

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid shipment ID" }, { status: 400 });
    }

    const result = await db.collection("shipments").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Shipment not found" }, { status: 404 });
    }

    // Also delete tracking events
    await db.collection("tracking_events").deleteMany({ shipmentId: id });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete shipment:", error);
    return NextResponse.json({ error: "Failed to delete shipment" }, { status: 500 });
  }
}
