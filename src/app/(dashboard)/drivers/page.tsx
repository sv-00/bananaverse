"use client";

import { useState } from "react";
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  Star,
  MapPin,
  Clock,
  Package,
  TrendingUp,
  Eye,
  Edit,
  MoreVertical,
} from "lucide-react";

type DriverStatus = "available" | "on_duty" | "on_break" | "offline";

interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  image?: string;
  status: DriverStatus;
  vehicle?: string;
  location?: string;
  rating: number;
  totalDeliveries: number;
  onTimeRate: number;
  activeShipments: number;
  joinedDate: string;
}

const mockDrivers: Driver[] = [
  { id: "1", name: "Amit Kumar", phone: "+91 98765 43210", email: "amit@example.com", status: "on_duty", vehicle: "KA-01-AB-1234", location: "Mumbai-Pune Highway", rating: 4.8, totalDeliveries: 1250, onTimeRate: 96, activeShipments: 3, joinedDate: "2022-03-15" },
  { id: "2", name: "Suresh Reddy", phone: "+91 87654 32109", email: "suresh@example.com", status: "on_duty", vehicle: "KA-05-IJ-7890", location: "Bangalore-Chennai Route", rating: 4.9, totalDeliveries: 2100, onTimeRate: 98, activeShipments: 2, joinedDate: "2021-08-20" },
  { id: "3", name: "Ravi Sharma", phone: "+91 76543 21098", email: "ravi@example.com", status: "available", rating: 4.5, totalDeliveries: 890, onTimeRate: 92, activeShipments: 0, joinedDate: "2023-01-10" },
  { id: "4", name: "Karthik M", phone: "+91 65432 10987", email: "karthik@example.com", status: "on_break", vehicle: "TN-04-GH-3456", rating: 4.7, totalDeliveries: 1560, onTimeRate: 94, activeShipments: 0, joinedDate: "2022-06-05" },
  { id: "5", name: "Ravi Teja", phone: "+91 54321 09876", email: "teja@example.com", status: "on_duty", vehicle: "MH-02-CD-5678", location: "Hyderabad City", rating: 4.6, totalDeliveries: 980, onTimeRate: 91, activeShipments: 4, joinedDate: "2023-04-18" },
  { id: "6", name: "Prakash Rao", phone: "+91 43210 98765", email: "prakash@example.com", status: "offline", rating: 4.3, totalDeliveries: 450, onTimeRate: 88, activeShipments: 0, joinedDate: "2023-09-01" },
];

const statusConfig: Record<DriverStatus, { label: string; color: string; dot: string }> = {
  available: { label: "Available", color: "bg-green-100 text-green-700", dot: "bg-green-500" },
  on_duty: { label: "On Duty", color: "bg-blue-100 text-blue-700", dot: "bg-blue-500" },
  on_break: { label: "On Break", color: "bg-yellow-100 text-yellow-700", dot: "bg-yellow-500" },
  offline: { label: "Offline", color: "bg-gray-100 text-gray-700", dot: "bg-gray-400" },
};

export default function DriversPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<DriverStatus | "all">("all");

  const filteredDrivers = mockDrivers.filter((d) => {
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.phone.includes(searchQuery) ||
      d.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: mockDrivers.length,
    onDuty: mockDrivers.filter((d) => d.status === "on_duty").length,
    available: mockDrivers.filter((d) => d.status === "available").length,
    avgRating: (mockDrivers.reduce((sum, d) => sum + d.rating, 0) / mockDrivers.length).toFixed(1),
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Drivers</h1>
          <p className="text-gray-500 mt-1">Manage your delivery team</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-400 transition-colors font-medium">
          <Plus className="w-4 h-4" />
          Add Driver
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg"><Users className="w-5 h-5 text-purple-600" /></div>
            <div>
              <p className="text-sm text-gray-500">Total Drivers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg"><Clock className="w-5 h-5 text-blue-600" /></div>
            <div>
              <p className="text-sm text-gray-500">On Duty</p>
              <p className="text-2xl font-bold text-gray-900">{stats.onDuty}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg"><TrendingUp className="w-5 h-5 text-green-600" /></div>
            <div>
              <p className="text-sm text-gray-500">Available</p>
              <p className="text-2xl font-bold text-gray-900">{stats.available}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg"><Star className="w-5 h-5 text-yellow-600" /></div>
            <div>
              <p className="text-sm text-gray-500">Avg Rating</p>
              <p className="text-2xl font-bold text-gray-900">{stats.avgRating}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, phone, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as DriverStatus | "all")}
          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none bg-white"
        >
          <option value="all">All Status</option>
          {Object.entries(statusConfig).map(([key, { label }]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {/* Drivers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDrivers.map((driver) => (
          <div key={driver.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-700 font-semibold text-lg">
                      {driver.name.charAt(0)}
                    </div>
                    <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${statusConfig[driver.status].dot}`} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{driver.name}</p>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig[driver.status].color}`}>
                      {statusConfig[driver.status].label}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-medium text-gray-900">{driver.rating}</span>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4 text-gray-400" />
                  {driver.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4 text-gray-400" />
                  {driver.email}
                </div>
                {driver.location && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="truncate">{driver.location}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <p className="text-lg font-bold text-gray-900">{driver.totalDeliveries}</p>
                  <p className="text-xs text-gray-500">Deliveries</p>
                </div>
                <div className="p-2 bg-gray-50 rounded-lg">
                  <p className="text-lg font-bold text-gray-900">{driver.onTimeRate}%</p>
                  <p className="text-xs text-gray-500">On-Time</p>
                </div>
                <div className="p-2 bg-gray-50 rounded-lg">
                  <p className="text-lg font-bold text-gray-900">{driver.activeShipments}</p>
                  <p className="text-xs text-gray-500">Active</p>
                </div>
              </div>
            </div>
            <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <span className="text-sm text-gray-500">Since {new Date(driver.joinedDate).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</span>
              <div className="flex items-center gap-1">
                <button className="p-1.5 hover:bg-gray-200 rounded transition-colors"><Eye className="w-4 h-4 text-gray-500" /></button>
                <button className="p-1.5 hover:bg-gray-200 rounded transition-colors"><Edit className="w-4 h-4 text-gray-500" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
