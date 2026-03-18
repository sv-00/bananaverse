"use client";

import { useState } from "react";
import {
  Warehouse,
  Search,
  Plus,
  MapPin,
  Clock,
  Package,
  Users,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
} from "lucide-react";

type HubType = "warehouse" | "distribution_center" | "pickup_point" | "drop_point";

interface Hub {
  id: string;
  name: string;
  code: string;
  type: HubType;
  address: string;
  city: string;
  manager: { name: string; phone: string; email: string };
  capacity: { total: number; used: number };
  operatingHours: string;
  zones: number;
  isActive: boolean;
}

const mockHubs: Hub[] = [
  { id: "1", name: "Mumbai Central Hub", code: "MUM-01", type: "warehouse", address: "Andheri East, Mumbai", city: "Mumbai", manager: { name: "Rajesh Patel", phone: "+91 98765 11111", email: "rajesh@bananaverse.com" }, capacity: { total: 5000, used: 3200 }, operatingHours: "6:00 AM - 10:00 PM", zones: 12, isActive: true },
  { id: "2", name: "Bangalore Tech Park DC", code: "BLR-01", type: "distribution_center", address: "Electronic City, Bangalore", city: "Bangalore", manager: { name: "Priya Sharma", phone: "+91 98765 22222", email: "priya@bananaverse.com" }, capacity: { total: 8000, used: 6500 }, operatingHours: "24/7", zones: 18, isActive: true },
  { id: "3", name: "Delhi NCR Warehouse", code: "DEL-01", type: "warehouse", address: "Gurgaon Sector 18", city: "Delhi NCR", manager: { name: "Amit Singh", phone: "+91 98765 33333", email: "amit@bananaverse.com" }, capacity: { total: 6000, used: 4100 }, operatingHours: "6:00 AM - 11:00 PM", zones: 15, isActive: true },
  { id: "4", name: "Chennai Port Hub", code: "CHN-01", type: "distribution_center", address: "Ambattur Industrial Estate", city: "Chennai", manager: { name: "Karthik R", phone: "+91 98765 44444", email: "karthik@bananaverse.com" }, capacity: { total: 4000, used: 2800 }, operatingHours: "7:00 AM - 9:00 PM", zones: 8, isActive: true },
  { id: "5", name: "Hyderabad Pickup Point", code: "HYD-PP1", type: "pickup_point", address: "Madhapur, Hyderabad", city: "Hyderabad", manager: { name: "Srinivas K", phone: "+91 98765 55555", email: "srinivas@bananaverse.com" }, capacity: { total: 500, used: 320 }, operatingHours: "9:00 AM - 8:00 PM", zones: 3, isActive: true },
  { id: "6", name: "Pune Drop Point", code: "PUN-DP1", type: "drop_point", address: "Hinjewadi Phase 2", city: "Pune", manager: { name: "Sneha Joshi", phone: "+91 98765 66666", email: "sneha@bananaverse.com" }, capacity: { total: 300, used: 180 }, operatingHours: "10:00 AM - 7:00 PM", zones: 2, isActive: false },
];

const typeConfig: Record<HubType, { label: string; color: string; icon: string }> = {
  warehouse: { label: "Warehouse", color: "bg-blue-100 text-blue-700", icon: "🏭" },
  distribution_center: { label: "Distribution Center", color: "bg-purple-100 text-purple-700", icon: "📦" },
  pickup_point: { label: "Pickup Point", color: "bg-green-100 text-green-700", icon: "📍" },
  drop_point: { label: "Drop Point", color: "bg-orange-100 text-orange-700", icon: "🎯" },
};

export default function HubsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<HubType | "all">("all");

  const filteredHubs = mockHubs.filter((h) => {
    const matchesSearch = h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || h.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hubs & Warehouses</h1>
          <p className="text-gray-500 mt-1">Manage your logistics network</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-400 transition-colors font-medium">
          <Plus className="w-4 h-4" />
          Add Hub
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Total Hubs</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{mockHubs.length}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Active</p>
          <p className="text-3xl font-bold text-green-600 mt-1">{mockHubs.filter((h) => h.isActive).length}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Total Capacity</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{(mockHubs.reduce((sum, h) => sum + h.capacity.total, 0) / 1000).toFixed(1)}K</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Utilization</p>
          <p className="text-3xl font-bold text-yellow-600 mt-1">
            {Math.round((mockHubs.reduce((sum, h) => sum + h.capacity.used, 0) / mockHubs.reduce((sum, h) => sum + h.capacity.total, 0)) * 100)}%
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, code, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as HubType | "all")}
          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none bg-white"
        >
          <option value="all">All Types</option>
          {Object.entries(typeConfig).map(([key, { label }]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {/* Hubs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredHubs.map((hub) => (
          <div key={hub.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{typeConfig[hub.type].icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{hub.name}</h3>
                      {hub.isActive ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{hub.code}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${typeConfig[hub.type].color}`}>
                  {typeConfig[hub.type].label}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    {hub.address}, {hub.city}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4 text-gray-400" />
                    {hub.operatingHours}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4 text-gray-400" />
                    {hub.manager.name}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4 text-gray-400" />
                    {hub.manager.phone}
                  </div>
                </div>
              </div>

              {/* Capacity Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Capacity</span>
                  <span className="font-medium text-gray-900">{hub.capacity.used.toLocaleString()} / {hub.capacity.total.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${(hub.capacity.used / hub.capacity.total) > 0.9 ? "bg-red-500" : (hub.capacity.used / hub.capacity.total) > 0.7 ? "bg-yellow-500" : "bg-green-500"}`}
                    style={{ width: `${(hub.capacity.used / hub.capacity.total) * 100}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-gray-500">{hub.zones} service zones</span>
                <button className="text-yellow-600 hover:text-yellow-700 font-medium">View Details →</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
