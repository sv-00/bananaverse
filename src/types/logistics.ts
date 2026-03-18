import { ObjectId } from "mongodb";

// ============================================================================
// CORE ENTITIES
// ============================================================================

export type ShipmentStatus = 
  | "pending"           // Created, awaiting pickup
  | "assigned"          // Assigned to driver
  | "picked_up"         // Picked up from origin
  | "in_transit"        // On the way
  | "at_hub"            // At intermediate hub
  | "out_for_delivery"  // Final mile delivery
  | "delivered"         // Successfully delivered
  | "failed"            // Delivery failed
  | "returned"          // Returned to sender
  | "cancelled";        // Cancelled

export type VehicleType = "bike" | "van" | "truck" | "container";
export type VehicleStatus = "available" | "in_use" | "maintenance" | "offline";
export type DriverStatus = "available" | "on_duty" | "on_break" | "offline";
export type HubType = "warehouse" | "distribution_center" | "pickup_point" | "drop_point";

export interface GeoLocation {
  lat: number;
  lng: number;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

export interface TimeWindow {
  start: Date;
  end: Date;
}

// ============================================================================
// SHIPMENT
// ============================================================================

export interface Shipment {
  _id?: ObjectId;
  trackingId: string;           // Public tracking number
  status: ShipmentStatus;
  
  // Origin & Destination
  origin: GeoLocation;
  destination: GeoLocation;
  
  // Customer info
  sender: {
    name: string;
    phone: string;
    email?: string;
  };
  recipient: {
    name: string;
    phone: string;
    email?: string;
  };
  
  // Package details
  package: {
    weight: number;             // kg
    dimensions?: {
      length: number;
      width: number;
      height: number;
    };
    description: string;
    fragile: boolean;
    requiresSignature: boolean;
    declaredValue?: number;
  };
  
  // Scheduling
  pickupWindow?: TimeWindow;
  deliveryWindow?: TimeWindow;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  
  // Assignment
  assignedDriverId?: string;
  assignedVehicleId?: string;
  routeId?: string;
  
  // Proof of delivery
  proofOfDelivery?: {
    signature?: string;         // Base64 image
    photo?: string;             // URL
    recipientName?: string;
    notes?: string;
    timestamp: Date;
    location: GeoLocation;
  };
  
  // Pricing
  pricing?: {
    baseRate: number;
    distanceCharge: number;
    weightCharge: number;
    surcharges: { name: string; amount: number }[];
    total: number;
    currency: string;
  };
  
  // Metadata
  priority: "standard" | "express" | "same_day" | "scheduled";
  tags?: string[];
  notes?: string;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// DRIVER
// ============================================================================

export interface Driver {
  _id?: ObjectId;
  userId: string;               // Reference to user account
  
  // Personal info
  name: string;
  phone: string;
  email: string;
  image?: string;
  
  // License & verification
  license: {
    number: string;
    type: string;
    expiresAt: Date;
    verified: boolean;
  };
  
  // Status
  status: DriverStatus;
  currentLocation?: GeoLocation;
  lastLocationUpdate?: Date;
  
  // Assignment
  assignedVehicleId?: string;
  currentRouteId?: string;
  activeShipmentIds: string[];
  
  // Performance metrics
  metrics: {
    totalDeliveries: number;
    successfulDeliveries: number;
    failedDeliveries: number;
    averageRating: number;
    totalRatings: number;
    onTimePercentage: number;
  };
  
  // Availability
  workingHours?: {
    [day: string]: { start: string; end: string } | null;
  };
  
  // Metadata
  zones?: string[];             // Assigned delivery zones
  vehicleTypes: VehicleType[];  // Can operate these vehicle types
  
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// VEHICLE
// ============================================================================

export interface Vehicle {
  _id?: ObjectId;
  
  // Identification
  registrationNumber: string;
  type: VehicleType;
  make: string;
  model: string;
  year: number;
  
  // Status
  status: VehicleStatus;
  currentLocation?: GeoLocation;
  lastLocationUpdate?: Date;
  
  // Capacity
  capacity: {
    weight: number;             // kg
    volume: number;             // cubic meters
    pallets?: number;
  };
  
  // Assignment
  assignedDriverId?: string;
  currentRouteId?: string;
  
  // Maintenance
  maintenance: {
    lastService: Date;
    nextServiceDue: Date;
    odometerReading: number;
    fuelLevel?: number;
  };
  
  // Features
  features: {
    refrigerated: boolean;
    liftGate: boolean;
    gps: boolean;
    dashcam: boolean;
  };
  
  // Insurance & docs
  insurance: {
    provider: string;
    policyNumber: string;
    expiresAt: Date;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// ROUTE
// ============================================================================

export interface RouteStop {
  shipmentId: string;
  type: "pickup" | "delivery";
  location: GeoLocation;
  scheduledTime?: Date;
  actualTime?: Date;
  status: "pending" | "arrived" | "completed" | "skipped";
  sequence: number;
  estimatedDuration: number;    // minutes
  notes?: string;
}

export interface Route {
  _id?: ObjectId;
  
  // Assignment
  driverId: string;
  vehicleId: string;
  
  // Status
  status: "planned" | "in_progress" | "completed" | "cancelled";
  
  // Stops
  stops: RouteStop[];
  
  // Optimization
  totalDistance: number;        // km
  totalDuration: number;        // minutes
  optimizedAt?: Date;
  
  // Timing
  plannedStart: Date;
  plannedEnd: Date;
  actualStart?: Date;
  actualEnd?: Date;
  
  // Metrics
  completedStops: number;
  totalStops: number;
  
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// HUB / WAREHOUSE
// ============================================================================

export interface Hub {
  _id?: ObjectId;
  
  name: string;
  code: string;                 // Short code like "BLR-01"
  type: HubType;
  
  location: GeoLocation;
  
  // Capacity
  capacity: {
    totalSlots: number;
    usedSlots: number;
    maxWeight: number;          // kg
  };
  
  // Operations
  operatingHours: {
    [day: string]: { open: string; close: string } | null;
  };
  
  // Contact
  manager?: {
    name: string;
    phone: string;
    email: string;
  };
  
  // Coverage
  serviceZones: string[];       // ZIP codes or zone IDs
  
  // Status
  isActive: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// TRACKING EVENT
// ============================================================================

export interface TrackingEvent {
  _id?: ObjectId;
  shipmentId: string;
  
  status: ShipmentStatus;
  location?: GeoLocation;
  
  description: string;
  
  // Actor
  actorType: "system" | "driver" | "hub" | "customer";
  actorId?: string;
  
  // Metadata
  metadata?: Record<string, unknown>;
  
  timestamp: Date;
}

// ============================================================================
// ZONE
// ============================================================================

export interface Zone {
  _id?: ObjectId;
  
  name: string;
  code: string;
  
  // Geographic boundary (GeoJSON polygon)
  boundary: {
    type: "Polygon";
    coordinates: number[][][];
  };
  
  // Pricing
  baseRate: number;
  perKmRate: number;
  
  // Assignment
  assignedHubId?: string;
  assignedDriverIds: string[];
  
  // Status
  isActive: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// ANALYTICS
// ============================================================================

export interface DailyMetrics {
  _id?: ObjectId;
  date: Date;
  
  shipments: {
    created: number;
    delivered: number;
    failed: number;
    returned: number;
  };
  
  performance: {
    onTimeDeliveryRate: number;
    averageDeliveryTime: number;  // minutes
    firstAttemptSuccessRate: number;
  };
  
  fleet: {
    activeDrivers: number;
    activeVehicles: number;
    totalDistance: number;        // km
  };
  
  revenue: {
    total: number;
    byPriority: Record<string, number>;
  };
}
