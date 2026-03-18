"use client";

import { useState } from "react";
import {
  Package,
  Search,
  Filter,
  Plus,
  MoreVertical,
  MapPin,
  Clock,
  User,
  Phone,
  ChevronDown,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
} from "lucide-react";

type ShipmentStatus = "pending" | "assigned" | "picked_up" | "in_transit" | "at_hub" | "out_for_delivery" | "delivered" | "failed";
type Priority = "standard" | "express" | "same_day" | "scheduled";

interface Shipment {
  id: string;
  trackingId: string;
  status: ShipmentStatus;
  priority: Priority;
  origin: { city: string; address: string };
  destination: { city: string; address: string };
  sender: { name: string; phone: string };
  recipient: { name: string; phone: string };
  package: { weight: number; description: string };
  estimatedDelivery: string;
  driver?: string;
  createdAt: string;
}

const mockShipments: Shipment[] = [
  {
    id: "1",
    trackingId: "BV-2024-8847",
    status: "in_transit",
    priority: "express",
    origin: { city: "Mumbai", address: "Andheri West, Mumbai 400053" },
    destination: { city: "Pune", address: "Koregaon Park, Pune 411001" },
    sender: { name: "Rahul Sharma", phone: "+91 98765 43210" },
    recipient: { name: "Priya Patel", phone: "+91 87654 32109" },
    package: { weight: 2.5, description: "Electronics - Laptop" },
    estimatedDelivery: "Today, 6:00 PM",
    driver: "Amit Kumar",
    createdAt: "2024-03-18T09:30:00",
  },
  {
    id: "2",
    trackingId: "BV-2024-8846",
    status: "out_for_delivery",
    priority: "same_day",
    origin: { city: "Bangalore", address: "Indiranagar, Bangalore 560038" },
    destination: { city: "Bangalore", address: "Whitefield, Bangalore 560066" },
    sender: { name: "Tech Solutions Pvt Ltd", phone: "+91 80 4567 8901" },
    recipient: { name: "Vikram Singh", phone: "+91 76543 21098" },
    package: { weight: 0.5, description: "Documents" },
    estimatedDelivery: "Today, 2:00 PM",
    driver: "Suresh Reddy",
    createdAt: "2024-03-18T08:15:00",
  },
  {
    id: "3",
    trackingId: "BV-2024-8845",
    status: "pending",
    priority: "standard",
    origin: { city: "Delhi", address: "Connaught Place, Delhi 110001" },
    destination: { city: "Jaipur", address: "C-Scheme, Jaipur 302001" },
    sender: { name: "Fashion Hub", phone: "+91 11 2345 6789" },
    recipient: { name: "Meera Gupta", phone: "+91 65432 10987" },
    package: { weight: 1.2, description: "Clothing - 3 items" },
    estimatedDelivery: "Tomorrow, 12:00 PM",
    createdAt: "2024-03-18T10:00:00",
  },
  {
    id: "4",
    trackingId: "BV-2024-8844",
    status: "at_hub",
    priority: "express",
    origin: { city: "Chennai", address: "T. Nagar, Chennai 600017" },
    destination: { city: "Coimbatore", address: "RS Puram, Coimbatore 641002" },
    sender: { name: "Medical Supplies Co", phone: "+91 44 8765 4321" },
    recipient: { name: "City Hospital", phone: "+91 54321 09876" },
    package: { weight: 5.0, description: "Medical Equipment" },
    estimatedDelivery: "Today, 8:00 PM",
    driver: "Karthik M",
    createdAt: "2024-03-18T07:45:00",
  },
  {
    id: "5",
    trackingId: "BV-2024-8843",
    status: "delivered",
    priority: "standard",
    origin: { city: "Hyderabad", address: "Banjara Hills, Hyderabad 500034" },
    destination: { city: "Hyderabad", address: "Gachibowli, Hyderabad 500032" },
    sender: { name: "Book World", phone: "+91 40 9876 5432" },
    recipient: { name: "Arun Reddy", phone: "+91 43210 98765" },
    package: { weight: 3.0, description: "Books - 5 items" },
    estimatedDelivery: "Delivered",
    driver: "Ravi Teja",
    createdAt: "2024-03-17T14:30:00",
  },
];

const statusConfig: Record<ShipmentStatus, { label: string; color: string }> = {
  pending: { label: "Pending", color: "bg-gray-100 text-gray-700" },
  assigned: { label: "Assigned", color: "bg-blue-100 text-blue-700" },
  picked_up: { label: "Picked Up", color: "bg-purple-100 text-purple-700" },
  in_transit: { label: "In Transit", color: "bg-indigo-100 text-indigo-700" },
  at_hub: { label: "At Hub", color: "bg-orange-100 text-orange-700" },
  out_for_delivery: { label: "Out for Delivery", color: "bg-yellow-100 text-yellow-700" },
  delivered: { label: "Delivered", color: "bg-green-100 text-green-700" },
  failed: { label: "Failed", color: "bg-red-100 text-red-700" },
};

const priorityConfig: Record<Priority, { label: string; color: string }> = {
  standard: { label: "Standard", color: "border-gray-300 text-gray-600" },
  express: { label: "Express", color: "border-blue-400 text-blue-600" },
  same_day: { label: "Same Day", color: "border-yellow-400 text-yellow-600" },
  scheduled: { label: "Scheduled", color: "border-purple-400 text-purple-600" },
};

export default function ShipmentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ShipmentStatus | "all">("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);

  const filteredShipments = mockShipments.filter((s) => {
    const matchesSearch =
      s.trackingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.recipient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.destination.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shipments</h1>
          <p className="text-gray-500 mt-1">Manage and track all shipments</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            <Upload className="w-4 h-4" />
            Import
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-400 transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            New Shipment
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by tracking ID, recipient, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
          />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ShipmentStatus | "all")}
            className="appearance-none pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none bg-white"
          >
            <option value="all">All Status</option>
            {Object.entries(statusConfig).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {Object.entries(statusConfig).map(([key, { label, color }]) => {
          const count = mockShipments.filter((s) => s.status === key).length;
          return (
            <button
              key={key}
              onClick={() => setStatusFilter(key as ShipmentStatus)}
              className={`p-3 rounded-lg border transition-all ${
                statusFilter === key ? "ring-2 ring-yellow-500 border-yellow-500" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <p className="text-2xl font-bold text-gray-900">{count}</p>
              <p className="text-xs text-gray-500 truncate">{label}</p>
            </button>
          );
        })}
      </div>

      {/* Shipments Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Shipment</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Route</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Recipient</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">ETA</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Driver</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredShipments.map((shipment) => (
                <tr key={shipment.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                        <Package className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{shipment.trackingId}</p>
                        <p className="text-sm text-gray-500">{shipment.package.weight}kg • {shipment.package.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{shipment.origin.city}</span>
                      <span className="text-gray-400">→</span>
                      <span className="text-sm text-gray-900 font-medium">{shipment.destination.city}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{shipment.recipient.name}</p>
                      <p className="text-sm text-gray-500">{shipment.recipient.phone}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[shipment.status].color}`}>
                        {statusConfig[shipment.status].label}
                      </span>
                      <span className={`px-2 py-0.5 rounded border text-xs font-medium ${priorityConfig[shipment.priority].color}`}>
                        {priorityConfig[shipment.priority].label}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      {shipment.estimatedDelivery}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {shipment.driver ? (
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                          <User className="w-4 h-4 text-yellow-700" />
                        </div>
                        <span className="text-sm text-gray-900">{shipment.driver}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">Unassigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="View">
                        <Eye className="w-4 h-4 text-gray-500" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Edit">
                        <Edit className="w-4 h-4 text-gray-500" />
                      </button>
                      <button className="p-2 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing <span className="font-medium">{filteredShipments.length}</span> of{" "}
            <span className="font-medium">{mockShipments.length}</span> shipments
          </p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50" disabled>
              Previous
            </button>
            <button className="px-3 py-1.5 bg-yellow-500 text-gray-900 rounded-lg text-sm font-medium">1</button>
            <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">2</button>
            <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
