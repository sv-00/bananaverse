// types/maps.ts
export interface Task {
    id: string;
    name: string;
    lat: number;
    lng: number;
    quantity: number;
    completed: boolean;
    imageUrl?: string | null;
    createdAt: string;
}

export interface MapMarker {
    id: string;
    marker: google.maps.marker.AdvancedMarkerElement;
    infoWindow: google.maps.InfoWindow;
    taskId: string;
}