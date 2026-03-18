"use client";

import { useState, useEffect } from "react";
import {
  Package,
  Truck,
  Users,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Zap,
} from "lucide-react";

interface MetricCard {
  title: string;
  value: string | number;
  change: number;
  icon: React.ElementType;
  color: string;
}

interface RecentShipment {
  id: string;
  trackingId: string;
  status: string;
  destination: string;
  eta: string;
}

export default function DashboardPage() {
  const [liveCount, setLiveCount] = useState(247);
  const [pulseActive, setPulseActive] = useState(true);

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount((prev) => prev + Math.floor(Math.random() * 3) - 1);
      setPulseActive((prev) => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const metrics: MetricCard[] = [
    {
      title: "Active Shipments",
      value: liveCount,
      change: 12.5,
      icon: Package,
      color: "bg-blue-500",
    },
    {
      title: "Fleet On Road",
      value: 42,
      change: 8.2,
      icon: Truck,
      color: "bg-green-500",
    },
    {
      title: "Active Drivers",
      value: 38,
      change: -2.1,
      icon: Users,
      color: "bg-purple-500",
    },
    {
      title: "On-Time Rate",
      value: "94.7%",
      change: 3.4,
      icon: TrendingUp,
      color: "bg-yellow-500",
    },
  ];

  const recentShipments: RecentShipment[] = [
    { id: "1", trackingId: "BV-2024-8847", status: "in_transit", destination: "Mumbai, MH", eta: "2h 15m" },
    { id: "2", trackingId: "BV-2024-8846", status: "out_for_delivery", destination: "Bangalore, KA", eta: "45m" },
    { id: "3", trackingId: "BV-2024-8845", status: "picked_up", destination: "Delhi, DL", eta: "6h 30m" },
    { id: "4", trackingId: "BV-2024-8844", status: "at_hub", destination: "Chennai, TN", eta: "4h 10m" },
    { id: "5", trackingId: "BV-2024-8843", status: "delivered", destination: "Hyderabad, TS", eta: "Delivered" },
  ];

  const statusColors: Record<string, string> = {
    pending: "bg-gray-100 text-gray-700",
    in_transit: "bg-blue-100 text-blue-700",
    out_for_delivery: "bg-yellow-100 text-yellow-700",
    picked_up: "bg-purple-100 text-purple-700",
    at_hub: "bg-orange-100 text-orange-700",
    delivered: "bg-green-100 text-green-700",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Real-time logistics overview</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full">
          <span className={`w-2 h-2 rounded-full bg-green-500 ${pulseActive ? "animate-pulse" : ""}`} />
          <span className="text-sm font-medium text-green-700">Live</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div
            key={metric.title}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-lg ${metric.color}`}>
                <metric.icon className="w-6 h-6 text-white" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${
                metric.change >= 0 ? "text-green-600" : "text-red-600"
              }`}>
                {metric.change >= 0 ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                {Math.abs(metric.change)}%
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
              <p className="text-sm text-gray-500 mt-1">{metric.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Shipments */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Shipments</h2>
              <a href="/shipments" className="text-sm text-yellow-600 hover:text-yellow-700 font-medium">
                View all →
              </a>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {recentShipments.map((shipment) => (
              <div key={shipment.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                      <Package className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{shipment.trackingId}</p>
                      <p className="text-sm text-gray-500">{shipment.destination}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[shipment.status]}`}>
                      {shipment.status.replace(/_/g, " ")}
                    </span>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      {shipment.eta}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          {/* Performance Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Performance</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-gray-600">Delivered</span>
                </div>
                <span className="font-semibold text-gray-900">156</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-blue-500" />
                  <span className="text-gray-600">In Transit</span>
                </div>
                <span className="font-semibold text-gray-900">89</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  <span className="text-gray-600">Delayed</span>
                </div>
                <span className="font-semibold text-gray-900">12</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-purple-500" />
                  <span className="text-gray-600">Express</span>
                </div>
                <span className="font-semibold text-gray-900">34</span>
              </div>
            </div>
          </div>

          {/* Fleet Status */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">Fleet Status</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">Utilization</span>
                  <span className="font-medium">78%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500 rounded-full" style={{ width: "78%" }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                  <p className="text-2xl font-bold">42</p>
                  <p className="text-xs text-gray-400">Active</p>
                </div>
                <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-xs text-gray-400">Available</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
