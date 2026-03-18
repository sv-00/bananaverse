"use client";

import { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Package,
  Truck,
  Clock,
  IndianRupee,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

interface MetricData {
  label: string;
  value: string;
  change: number;
  trend: "up" | "down";
}

interface ChartData {
  label: string;
  value: number;
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");

  const metrics: MetricData[] = [
    { label: "Total Shipments", value: "12,847", change: 12.5, trend: "up" },
    { label: "Delivered", value: "11,923", change: 8.3, trend: "up" },
    { label: "On-Time Rate", value: "94.2%", change: 2.1, trend: "up" },
    { label: "Avg Delivery Time", value: "2.4 hrs", change: -15.2, trend: "up" },
    { label: "Revenue", value: "₹48.5L", change: 18.7, trend: "up" },
    { label: "Failed Deliveries", value: "312", change: -8.4, trend: "up" },
  ];

  const deliveryByCity: ChartData[] = [
    { label: "Mumbai", value: 3245 },
    { label: "Bangalore", value: 2890 },
    { label: "Delhi", value: 2456 },
    { label: "Chennai", value: 1823 },
    { label: "Hyderabad", value: 1567 },
    { label: "Pune", value: 866 },
  ];

  const deliveryByPriority: ChartData[] = [
    { label: "Standard", value: 6234 },
    { label: "Express", value: 4123 },
    { label: "Same Day", value: 1890 },
    { label: "Scheduled", value: 600 },
  ];

  const weeklyTrend = [
    { day: "Mon", deliveries: 1823, revenue: 685000 },
    { day: "Tue", deliveries: 1956, revenue: 734000 },
    { day: "Wed", deliveries: 2134, revenue: 801000 },
    { day: "Thu", deliveries: 1987, revenue: 746000 },
    { day: "Fri", deliveries: 2245, revenue: 843000 },
    { day: "Sat", deliveries: 1678, revenue: 630000 },
    { day: "Sun", deliveries: 1024, revenue: 384000 },
  ];

  const maxDeliveries = Math.max(...weeklyTrend.map((d) => d.deliveries));
  const maxCityDeliveries = Math.max(...deliveryByCity.map((d) => d.value));

  const priorityColors: Record<string, string> = {
    Standard: "bg-gray-500",
    Express: "bg-blue-500",
    "Same Day": "bg-yellow-500",
    Scheduled: "bg-purple-500",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-500 mt-1">Performance insights and trends</p>
        </div>
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
          {(["7d", "30d", "90d"] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                timeRange === range ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {range === "7d" ? "7 Days" : range === "30d" ? "30 Days" : "90 Days"}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">{metric.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
            <div className={`flex items-center gap-1 mt-2 text-sm ${
              (metric.trend === "up" && metric.change > 0) || (metric.trend === "up" && metric.change < 0)
                ? "text-green-600"
                : "text-red-600"
            }`}>
              {metric.change > 0 ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : (
                <ArrowDownRight className="w-4 h-4" />
              )}
              {Math.abs(metric.change)}%
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Trend */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Weekly Delivery Trend</h3>
          <div className="flex items-end justify-between gap-2 h-48">
            {weeklyTrend.map((day) => (
              <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col items-center">
                  <span className="text-xs text-gray-500 mb-1">{day.deliveries}</span>
                  <div
                    className="w-full bg-yellow-500 rounded-t-md transition-all hover:bg-yellow-400"
                    style={{ height: `${(day.deliveries / maxDeliveries) * 150}px` }}
                  />
                </div>
                <span className="text-xs font-medium text-gray-600">{day.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery by City */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Deliveries by City</h3>
          <div className="space-y-4">
            {deliveryByCity.map((city) => (
              <div key={city.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{city.label}</span>
                  <span className="font-medium text-gray-900">{city.value.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full"
                    style={{ width: `${(city.value / maxCityDeliveries) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Priority Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">By Priority</h3>
          <div className="space-y-4">
            {deliveryByPriority.map((item) => {
              const total = deliveryByPriority.reduce((sum, i) => sum + i.value, 0);
              const percentage = ((item.value / total) * 100).toFixed(1);
              return (
                <div key={item.label} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${priorityColors[item.label]}`} />
                  <div className="flex-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{item.label}</span>
                      <span className="font-medium text-gray-900">{percentage}%</span>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{item.value.toLocaleString()}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Fleet Performance */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Fleet Performance</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">Utilization Rate</span>
              </div>
              <span className="font-semibold text-gray-900">78%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">Avg Trip Duration</span>
              </div>
              <span className="font-semibold text-gray-900">3.2 hrs</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">Deliveries/Vehicle</span>
              </div>
              <span className="font-semibold text-gray-900">18.4</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <IndianRupee className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">Cost/Delivery</span>
              </div>
              <span className="font-semibold text-gray-900">₹42</span>
            </div>
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Drivers</h3>
          <div className="space-y-3">
            {[
              { name: "Suresh Reddy", deliveries: 234, rating: 4.9 },
              { name: "Amit Kumar", deliveries: 218, rating: 4.8 },
              { name: "Karthik M", deliveries: 201, rating: 4.7 },
              { name: "Ravi Teja", deliveries: 189, rating: 4.6 },
              { name: "Ravi Sharma", deliveries: 176, rating: 4.5 },
            ].map((driver, index) => (
              <div key={driver.name} className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  index === 0 ? "bg-yellow-100 text-yellow-700" :
                  index === 1 ? "bg-gray-200 text-gray-700" :
                  index === 2 ? "bg-orange-100 text-orange-700" :
                  "bg-gray-100 text-gray-600"
                }`}>
                  {index + 1}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{driver.name}</p>
                  <p className="text-xs text-gray-500">{driver.deliveries} deliveries</p>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500">★</span>
                  <span className="text-sm font-medium text-gray-900">{driver.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
