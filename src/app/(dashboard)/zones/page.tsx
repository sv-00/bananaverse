"use client";

import { useState } from "react";
import {
  MapPin,
  Search,
  Plus,
  Users,
  Package,
  IndianRupee,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
} from "lucide-react";

interface Zone {
  id: string;
  name: string;
  code: string;
  hub: string;
  drivers: number;
  activeShipments: number;
  baseRate: number;
  perKmRate: number;
  avgDeliveryTime: number;
  isActive: boolean;
  coverage: string[];
}

const mockZones: Zone[] = [
  { id: "1", name: "Mumbai Central", code: "MUM-C", hub: "Mumbai Central Hub", drivers: 8, activeShipments: 45, baseRate: 50, perKmRate: 8, avgDeliveryTime: 35, isActive: true, coverage: ["400001", "400002", "400003", "400004"] },
  { id: "2", name: "Mumbai Suburbs", code: "MUM-S", hub: "Mumbai Central Hub", drivers: 12, activeShipments: 67, baseRate: 60, perKmRate: 10, avgDeliveryTime: 45, isActive: true, coverage: ["400053", "400054", "400055", "400056", "400057"] },
  { id: "3", name: "Bangalore Tech Corridor", code: "BLR-TC", hub: "Bangalore Tech Park DC", drivers: 15, activeShipments: 89, baseRate: 45, perKmRate: 7, avgDeliveryTime: 30, isActive: true, coverage: ["560001", "560002", "560003", "560004", "560005"] },
  { id: "4", name: "Bangalore Outer Ring", code: "BLR-OR", hub: "Bangalore Tech Park DC", drivers: 10, activeShipments: 52, baseRate: 55, perKmRate: 9, avgDeliveryTime: 40, isActive: true, coverage: ["560066", "560067", "560068", "560069"] },
  { id: "5", name: "Delhi Central", code: "DEL-C", hub: "Delhi NCR Warehouse", drivers: 9, activeShipments: 38, baseRate: 55, perKmRate: 9, avgDeliveryTime: 42, isActive: true, coverage: ["110001", "110002", "110003"] },
  { id: "6", name: "Gurgaon IT Hub", code: "GGN-IT", hub: "Delhi NCR Warehouse", drivers: 6, activeShipments: 28, baseRate: 65, perKmRate: 11, avgDeliveryTime: 38, isActive: false, coverage: ["122001", "122002", "122003"] },
];

export default function ZonesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "active" | "inactive">("all");

  const filteredZones = mockZones.filter((z) => {
    const matchesSearch = z.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      z.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      z.hub.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesActive = activeFilter === "all" || (activeFilter === "active" ? z.isActive : !z.isActive);
    return matchesSearch && matchesActive;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Delivery Zones</h1>
          <p className="text-gray-500 mt-1">Configure service areas and pricing</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-400 transition-colors font-medium">
          <Plus className="w-4 h-4" />
          Add Zone
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Total Zones</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{mockZones.length}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Active Zones</p>
          <p className="text-3xl font-bold text-green-600 mt-1">{mockZones.filter((z) => z.isActive).length}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Total Drivers</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{mockZones.reduce((sum, z) => sum + z.drivers, 0)}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Active Shipments</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">{mockZones.reduce((sum, z) => sum + z.activeShipments, 0)}</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search zones..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
          />
        </div>
        <select
          value={activeFilter}
          onChange={(e) => setActiveFilter(e.target.value as "all" | "active" | "inactive")}
          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none bg-white"
        >
          <option value="all">All Zones</option>
          <option value="active">Active Only</option>
          <option value="inactive">Inactive Only</option>
        </select>
      </div>

      {/* Zones Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Zone</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Hub</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Coverage</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Drivers</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Shipments</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Pricing</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Avg Time</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredZones.map((zone) => (
                <tr key={zone.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{zone.name}</p>
                      <p className="text-sm text-gray-500">{zone.code}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{zone.hub}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {zone.coverage.slice(0, 3).map((pin) => (
                        <span key={pin} className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">{pin}</span>
                      ))}
                      {zone.coverage.length > 3 && (
                        <span className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">+{zone.coverage.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{zone.drivers}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Package className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{zone.activeShipments}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <p className="text-gray-900">₹{zone.baseRate} base</p>
                      <p className="text-gray-500">₹{zone.perKmRate}/km</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{zone.avgDeliveryTime} min</td>
                  <td className="px-6 py-4">
                    {zone.isActive ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        <CheckCircle className="w-3 h-3" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                        <XCircle className="w-3 h-3" /> Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 hover:bg-gray-100 rounded transition-colors"><Edit className="w-4 h-4 text-gray-500" /></button>
                      <button className="p-1.5 hover:bg-red-50 rounded transition-colors"><Trash2 className="w-4 h-4 text-red-500" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
