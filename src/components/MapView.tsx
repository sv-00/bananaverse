// components/MapView/MapView.tsx
interface MapViewProps {
    mapRef: React.RefObject<HTMLDivElement | null>;
    status: string;
    taskCount: number;
}

export function MapView({ mapRef, status, taskCount }: MapViewProps) {
    return (
        <>
            <div ref={mapRef} className="h-screen w-full" />

            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg border">
                <p className="text-sm font-semibold text-gray-700">Status: {status}</p>
                <p className="text-xs text-gray-500 mt-1">Tasks: {taskCount}</p>
            </div>
        </>
    );
}