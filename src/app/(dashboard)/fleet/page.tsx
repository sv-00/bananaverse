"use client";

import { useState } from "react";
import {
  Truck,
  Search,
  Plus,
  MapPin,
  Fuel,
  Wrench,
  CheckCircle,
  XCircle,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";

type VehicleStatus = "available" | "in_use" | "maintenance" | "offline";
type VehicleType = "bike" | "van" | "truck" | "container";

interface Vehicle {
  id: string;
  registrationNumber: string;
  type: VehicleType;
  make: string;
  model: string;
  status: VehicleStatus;
  driver?: string;
  location?: string;
  fuelLevel: number;
  nextService: string;
  odometer: number;
}

const mockVehicles: Vehicle[] = [
  { id: "1", registrationNumber: "KA-01-AB-1234", type: "van", make: "Tata", model: "Ace", status: "in_use", driver: "Amit Kumar", location: "Mumbai-Pune Highway", fuelLevel: 65, nextService: "500 km", odometer: 45230 },
  { id: "2", registrationNumber: "MH-02-CD-5678", type: "truck", make: "Ashok Leyland", model: "Dost", status: "available", fuelLevel: 90, nextService: "2000 km", odometer: 32100 },
  { id: "3", registrationNumber: "DL-03-EF-9012", type: "bike", make: "Bajaj", model: "Pulsar", status: "in_use", driver: "Ravi Sharma", location: "Connaught Place", fuelLevel: 45, nextService: "1200 km", odometer: 12500 },
  { id: "4", registrationNumber: "TN-04-GH-3456", type: "van", make: "Mahindra", model: "Supro", status: "maintenance", fuelLevel: 30, nextService: "Due", odometer: 67800 },
  { id: "5", registrationNumber: "KA-05-IJ-7890", type: "container", make: "Eicher", model: "Pro 3015", status: "in_use", driver: "Suresh Reddy", location: "Bangalore-Chennai Route", fuelLevel: 55, nextService: "3500 km", odometer: 89400 },
  { id: "6", registrationNumber: "GJ-06-KL-2345", type: "truck", make: "Tata", model: "407", status: "offline", fuelLevel: 10, nextService: "Due", odometer: 102300 },
];

const statusConfig: Record<VehicleStatus, { label: string; color: string; icon: React.ElementType }> = {
  available: { label: "Available", color: "bg-green-100 text-green-700", icon: CheckCircle },
  in_use: { label: "In Use", color: "bg-blue-100 text-blue-700", icon: Truck },
  maintenance: { label: "Maintenance", color: "bg-yellow-100 text-yellow-700", icon: Wrench },
  offline: { label: "Offline", color: "bg-red-100 text-red-700", icon: XCircle },
};

const typeConfig: Record<VehicleType, { label: string; icon: string }> = {
  bike: { label: "Bike", icon: "🏍️" },
  van: { label: "Van", icon: "🚐" },
  truck: { label: "Truck", icon: "🚛" },
  container: { label: "Container", icon: "📦" },
};

export default function FleetPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<VehicleStatus | "all">("all");

  const filteredVehicles = mockVehicles.filter((v) => {
    const matchesSearch = v.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.model.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: mockVehicles.length,
    available: mockVehicles.filter((v) => v.status === "available").length,
    inUse: mockVehicles.filter((v) => v.status === "in_use").length,
    maintenance: mockVehicles.filter((v) => v.status === "maintenance").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fleet Management</h1>
          <p className="text-gray-500 mt-1">Monitor and manage your vehicle fleet</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-400 transition-colors font-medium">
          <Plus className="w-4 h-4" />
          Add Vehicle
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Total Vehicles</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Available</p>
          <p className="text-3xl font-bold text-green-600 mt-1">{stats.available}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">In Use</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">{stats.inUse}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Maintenance</p>
          <p className="text-3xl font-bold text-yellow-600 mt-1">{stats.maintenance}</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by registration, make, or model..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as VehicleStatus | "all")}
          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none bg-white"
        >
          <option value="all">All Status</option>
          {Object.entries(statusConfig).map(([key, { label }]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {/* Vehicle Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVehicles.map((vehicle) => (
          <div key={vehicle.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{typeConfig[vehicle.type].icon}</span>
                  <div>
                    <p className="font-semibold text-gray-900">{vehicle.registrationNumber}</p>
                    <p className="text-sm text-gray-500">{vehicle.make} {vehicle.model}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[vehicle.status].color}`}>
                  {statusConfig[vehicle.status].label}
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {vehicle.driver && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-400">Driver:</span>
                    <span className="text-gray-900">{vehicle.driver}</span>
                  </div>
                )}
                {vehicle.location && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 truncate">{vehicle.location}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Fuel className="w-4 h-4 text-gray-400" />
                    <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${vehicle.fuelLevel > 50 ? "bg-green-500" : vehicle.fuelLevel > 20 ? "bg-yellow-500" : "bg-red-500"}`}
                        style={{ width: `${vehicle.fuelLevel}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{vehicle.fuelLevel}%</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Wrench className="w-4 h-4 text-gray-400" />
                    <span className={`${vehicle.nextService === "Due" ? "text-red-600 font-medium" : "text-gray-500"}`}>
                      {vehicle.nextService}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <span className="text-sm text-gray-500">{vehicle.odometer.toLocaleString()} km</span>
              <div className="flex items-center gap-1">
                <button className="p-1.5 hover:bg-gray-200 rounded transition-colors"><Eye className="w-4 h-4 text-gray-500" /></button>
                <button className="p-1.5 hover:bg-gray-200 rounded transition-colors"><Edit className="w-4 h-4 text-gray-500" /></button>
                <button className="p-1.5 hover:bg-red-100 rounded transition-colors"><Trash2 className="w-4 h-4 text-red-500" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
