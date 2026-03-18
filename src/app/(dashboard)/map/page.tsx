"use client";

import { useState } from "react";
import {
  Map,
  Truck,
  Package,
  User,
  Filter,
  Layers,
  ZoomIn,
  ZoomOut,
  Locate,
  RefreshCw,
} from "lucide-react";

interface LiveVehicle {
  id: string;
  driver: string;
  vehicle: string;
  status: "moving" | "idle" | "delivering";
  location: { lat: number; lng: number; address: string };
  speed: number;
  activeShipments: number;
  lastUpdate: string;
}

const mockVehicles: LiveVehicle[] = [
  { id: "1", driver: "Amit Kumar", vehicle: "KA-01-AB-1234", status: "moving", location: { lat: 19.076, lng: 72.877, address: "Mumbai-Pune Expressway" }, speed: 65, activeShipments: 3, lastUpdate: "2 min ago" },
  { id: "2", driver: "Suresh Reddy", vehicle: "KA-05-IJ-7890", status: "delivering", location: { lat: 12.971, lng: 77.594, address: "Whitefield, Bangalore" }, speed: 0, activeShipments: 2, lastUpdate: "Just now" },
  { id: "3", driver: "Ravi Sharma", vehicle: "DL-03-EF-9012", status: "moving", location: { lat: 28.613, lng: 77.209, address: "Connaught Place, Delhi" }, speed: 35, activeShipments: 5, lastUpdate: "1 min ago" },
  { id: "4", driver: "Karthik M", vehicle: "TN-04-GH-3456", status: "idle", location: { lat: 13.082, lng: 80.270, address: "T. Nagar, Chennai" }, speed: 0, activeShipments: 0, lastUpdate: "5 min ago" },
  { id: "5", driver: "Ravi Teja", vehicle: "MH-02-CD-5678", status: "moving", location: { lat: 17.385, lng: 78.486, address: "Banjara Hills, Hyderabad" }, speed: 45, activeShipments: 4, lastUpdate: "30 sec ago" },
];

const statusConfig = {
  moving: { label: "Moving", color: "bg-green-500", textColor: "text-green-700", bgColor: "bg-green-100" },
  idle: { label: "Idle", color: "bg-yellow-500", textColor: "text-yellow-700", bgColor: "bg-yellow-100" },
  delivering: { label: "Delivering", color: "bg-blue-500", textColor: "text-blue-700", bgColor: "bg-blue-100" },
};

export default function MapPage() {
  const [selectedVehicle, setSelectedVehicle] = useState<LiveVehicle | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    moving: true,
    idle: true,
    delivering: true,
  });

  const filteredVehicles = mockVehicles.filter((v) => filters[v.status]);

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Live Map</h1>
          <p className="text-gray-500">Real-time fleet tracking</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
              showFilters ? "border-yellow-500 bg-yellow-50 text-yellow-700" : "border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-400 transition-colors font-medium">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Show:</span>
            {Object.entries(statusConfig).map(([key, config]) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters[key as keyof typeof filters]}
                  onChange={(e) => setFilters({ ...filters, [key]: e.target.checked })}
                  className="w-4 h-4 text-yellow-500 border-gray-300 rounded focus:ring-yellow-500"
                />
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}>
                  {config.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* Map Area */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative">
          {/* Placeholder Map */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <div className="text-center">
              <Map className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">Interactive Map</p>
              <p className="text-gray-400 text-sm mt-1">Google Maps integration required</p>
              <p className="text-gray-400 text-xs mt-4">Add NEXT_PUBLIC_GOOGLE_MAPS_KEY to .env</p>
            </div>
          </div>

          {/* Map Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <button className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors">
              <ZoomIn className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors">
              <ZoomOut className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors">
              <Locate className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors">
              <Layers className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Live Stats Overlay */}
          <div className="absolute bottom-4 left-4 flex gap-3">
            <div className="px-4 py-2 bg-white/90 backdrop-blur rounded-lg shadow-md">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-medium text-gray-900">{filteredVehicles.filter((v) => v.status === "moving").length} Moving</span>
              </div>
            </div>
            <div className="px-4 py-2 bg-white/90 backdrop-blur rounded-lg shadow-md">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-sm font-medium text-gray-900">{filteredVehicles.filter((v) => v.status === "delivering").length} Delivering</span>
              </div>
            </div>
            <div className="px-4 py-2 bg-white/90 backdrop-blur rounded-lg shadow-md">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-yellow-500" />
                <span className="text-sm font-medium text-gray-900">{filteredVehicles.filter((v) => v.status === "idle").length} Idle</span>
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle List */}
        <div className="w-80 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Active Vehicles</h3>
            <p className="text-sm text-gray-500">{filteredVehicles.length} vehicles tracked</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredVehicles.map((vehicle) => (
              <button
                key={vehicle.id}
                onClick={() => setSelectedVehicle(vehicle)}
                className={`w-full p-4 text-left border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  selectedVehicle?.id === vehicle.id ? "bg-yellow-50" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${statusConfig[vehicle.status].bgColor}`}>
                      <Truck className={`w-5 h-5 ${statusConfig[vehicle.status].textColor}`} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{vehicle.driver}</p>
                      <p className="text-sm text-gray-500">{vehicle.vehicle}</p>
                    </div>
                  </div>
                  <span className={`w-2 h-2 rounded-full ${statusConfig[vehicle.status].color}`} />
                </div>
                <div className="mt-3 text-sm text-gray-500">
                  <p className="truncate">{vehicle.location.address}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span>{vehicle.speed} km/h</span>
                    <span>{vehicle.activeShipments} shipments</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-2">{vehicle.lastUpdate}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Vehicle Detail */}
      {selectedVehicle && (
        <div className="mt-4 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${statusConfig[selectedVehicle.status].bgColor}`}>
                <Truck className={`w-6 h-6 ${statusConfig[selectedVehicle.status].textColor}`} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{selectedVehicle.driver}</h3>
                <p className="text-sm text-gray-500">{selectedVehicle.vehicle}</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{selectedVehicle.speed}</p>
                <p className="text-xs text-gray-500">km/h</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{selectedVehicle.activeShipments}</p>
                <p className="text-xs text-gray-500">Shipments</p>
              </div>
              <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${statusConfig[selectedVehicle.status].bgColor} ${statusConfig[selectedVehicle.status].textColor}`}>
                {statusConfig[selectedVehicle.status].label}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
