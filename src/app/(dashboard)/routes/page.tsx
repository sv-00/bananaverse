"use client";

import { useState } from "react";
import {
  Route,
  Search,
  Plus,
  Play,
  Pause,
  CheckCircle,
  Clock,
  MapPin,
  User,
  Truck,
  Navigation,
  Zap,
} from "lucide-react";

type RouteStatus = "planned" | "in_progress" | "completed" | "cancelled";

interface RouteData {
  id: string;
  name: string;
  status: RouteStatus;
  driver: string;
  vehicle: string;
  stops: number;
  completedStops: number;
  distance: number;
  duration: number;
  startTime: string;
  endTime?: string;
  efficiency: number;
}

const mockRoutes: RouteData[] = [
  { id: "1", name: "Mumbai Metro Route A", status: "in_progress", driver: "Amit Kumar", vehicle: "KA-01-AB-1234", stops: 8, completedStops: 5, distance: 45, duration: 180, startTime: "09:00 AM", efficiency: 94 },
  { id: "2", name: "Bangalore Express", status: "in_progress", driver: "Suresh Reddy", vehicle: "KA-05-IJ-7890", stops: 6, completedStops: 2, distance: 120, duration: 300, startTime: "08:30 AM", efficiency: 88 },
  { id: "3", name: "Delhi NCR Circuit", status: "planned", driver: "Ravi Sharma", vehicle: "DL-03-EF-9012", stops: 12, completedStops: 0, distance: 65, duration: 240, startTime: "02:00 PM", efficiency: 0 },
  { id: "4", name: "Chennai Hub Connect", status: "completed", driver: "Karthik M", vehicle: "TN-04-GH-3456", stops: 10, completedStops: 10, distance: 55, duration: 210, startTime: "07:00 AM", endTime: "11:30 AM", efficiency: 97 },
  { id: "5", name: "Hyderabad Ring", status: "in_progress", driver: "Ravi Teja", vehicle: "MH-02-CD-5678", stops: 7, completedStops: 4, distance: 38, duration: 150, startTime: "10:00 AM", efficiency: 91 },
];

const statusConfig: Record<RouteStatus, { label: string; color: string; icon: React.ElementType }> = {
  planned: { label: "Planned", color: "bg-gray-100 text-gray-700", icon: Clock },
  in_progress: { label: "In Progress", color: "bg-blue-100 text-blue-700", icon: Play },
  completed: { label: "Completed", color: "bg-green-100 text-green-700", icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-700", icon: Pause },
};

export default function RoutesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<RouteStatus | "all">("all");

  const filteredRoutes = mockRoutes.filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.driver.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Routes</h1>
          <p className="text-gray-500 mt-1">Plan and optimize delivery routes</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            <Zap className="w-4 h-4" />
            Auto-Optimize
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-400 transition-colors font-medium">
            <Plus className="w-4 h-4" />
            Create Route
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Active Routes</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">{mockRoutes.filter((r) => r.status === "in_progress").length}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Total Stops Today</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{mockRoutes.reduce((sum, r) => sum + r.stops, 0)}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="text-3xl font-bold text-green-600 mt-1">{mockRoutes.reduce((sum, r) => sum + r.completedStops, 0)}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Avg Efficiency</p>
          <p className="text-3xl font-bold text-yellow-600 mt-1">
            {Math.round(mockRoutes.filter((r) => r.efficiency > 0).reduce((sum, r) => sum + r.efficiency, 0) / mockRoutes.filter((r) => r.efficiency > 0).length)}%
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search routes or drivers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as RouteStatus | "all")}
          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none bg-white"
        >
          <option value="all">All Status</option>
          {Object.entries(statusConfig).map(([key, { label }]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {/* Routes List */}
      <div className="space-y-4">
        {filteredRoutes.map((route) => (
          <div key={route.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-5">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-yellow-100 rounded-xl">
                    <Navigation className="w-6 h-6 text-yellow-700" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-gray-900">{route.name}</h3>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[route.status].color}`}>
                        {statusConfig[route.status].label}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {route.driver}
                      </div>
                      <div className="flex items-center gap-1">
                        <Truck className="w-4 h-4" />
                        {route.vehicle}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {route.startTime} {route.endTime && `- ${route.endTime}`}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{route.completedStops}/{route.stops}</p>
                    <p className="text-xs text-gray-500">Stops</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{route.distance} km</p>
                    <p className="text-xs text-gray-500">Distance</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{Math.floor(route.duration / 60)}h {route.duration % 60}m</p>
                    <p className="text-xs text-gray-500">Duration</p>
                  </div>
                  {route.efficiency > 0 && (
                    <div className="text-center">
                      <p className={`text-2xl font-bold ${route.efficiency >= 90 ? "text-green-600" : route.efficiency >= 80 ? "text-yellow-600" : "text-red-600"}`}>
                        {route.efficiency}%
                      </p>
                      <p className="text-xs text-gray-500">Efficiency</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              {route.status === "in_progress" && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Progress</span>
                    <span className="font-medium text-gray-900">{Math.round((route.completedStops / route.stops) * 100)}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-500 rounded-full transition-all"
                      style={{ width: `${(route.completedStops / route.stops) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
