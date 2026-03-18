import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

// GET analytics data
export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const { searchParams } = new URL(request.url);
    
    const range = searchParams.get("range") || "30d";
    
    // Calculate date range
    const days = range === "7d" ? 7 : range === "90d" ? 90 : 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get shipment stats
    const shipmentStats = await db.collection("shipments").aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          delivered: { $sum: { $cond: [{ $eq: ["$status", "delivered"] }, 1, 0] } },
          failed: { $sum: { $cond: [{ $eq: ["$status", "failed"] }, 1, 0] } },
          pending: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } },
          inTransit: { $sum: { $cond: [{ $eq: ["$status", "in_transit"] }, 1, 0] } },
        },
      },
    ]).toArray();

    // Get shipments by priority
    const byPriority = await db.collection("shipments").aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $group: { _id: "$priority", count: { $sum: 1 } } },
    ]).toArray();

    // Get shipments by city
    const byCity = await db.collection("shipments").aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $group: { _id: "$destination.city", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]).toArray();

    // Get daily trend
    const dailyTrend = await db.collection("shipments").aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
          delivered: { $sum: { $cond: [{ $eq: ["$status", "delivered"] }, 1, 0] } },
        },
      },
      { $sort: { _id: 1 } },
    ]).toArray();

    // Get driver stats
    const driverStats = await db.collection("drivers").aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          available: { $sum: { $cond: [{ $eq: ["$status", "available"] }, 1, 0] } },
          onDuty: { $sum: { $cond: [{ $eq: ["$status", "on_duty"] }, 1, 0] } },
          avgRating: { $avg: "$metrics.averageRating" },
        },
      },
    ]).toArray();

    // Get vehicle stats
    const vehicleStats = await db.collection("vehicles").aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          available: { $sum: { $cond: [{ $eq: ["$status", "available"] }, 1, 0] } },
          inUse: { $sum: { $cond: [{ $eq: ["$status", "in_use"] }, 1, 0] } },
          maintenance: { $sum: { $cond: [{ $eq: ["$status", "maintenance"] }, 1, 0] } },
        },
      },
    ]).toArray();

    return NextResponse.json({
      shipments: shipmentStats[0] || { total: 0, delivered: 0, failed: 0, pending: 0, inTransit: 0 },
      byPriority: byPriority.reduce((acc, item) => ({ ...acc, [item._id]: item.count }), {}),
      byCity: byCity.map((item) => ({ city: item._id, count: item.count })),
      dailyTrend: dailyTrend.map((item) => ({ date: item._id, count: item.count, delivered: item.delivered })),
      drivers: driverStats[0] || { total: 0, available: 0, onDuty: 0, avgRating: 0 },
      vehicles: vehicleStats[0] || { total: 0, available: 0, inUse: 0, maintenance: 0 },
      range,
    });
  } catch (error) {
    console.error("Failed to fetch analytics:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
