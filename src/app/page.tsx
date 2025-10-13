// app/page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';
import { useGeolocation } from '@/hooks/useGeolocation';
import { MapControls } from '@/components/MapControls';
import { MapView } from '@/components/MapView';
import { Task } from '@/lib/taskService';

export default function BananaLaunderingMap() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const [showTaskInput, setShowTaskInput] = useState(false);
  const [pendingLocation, setPendingLocation] = useState<google.maps.LatLng | null>(null);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [loadAttempts, setLoadAttempts] = useState(0);

  // Custom hooks
  const { tasks, loading, error, loadTasks, createTask } = useTasks();
  const {
    status,
    setStatus,
    mapRef,
    mapInstance,
    initMap,
    loadGoogleMapsScript,
    addTaskMarkers,
    addPendingMarker,
    clearPendingMarker,
    useFallbackMarkers
  } = useGoogleMaps();
  const { getCurrentLocation, watchLocation } = useGeolocation();

  // Message helper
  const showMessage = useCallback((text: string, type: 'success' | 'error' | 'info' | 'warning') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3500);
  }, []);

  // Initialize Google Maps and then the map
  const initializeMapSystem = useCallback(async () => {
    if (!apiKey) {
      setStatus('❌ Missing Google Maps API key');
      return;
    }

    try {
      setStatus('Loading Google Maps...');
      await loadGoogleMapsScript(apiKey);
      setIsGoogleLoaded(true);
      setStatus('Google Maps loaded, initializing map...');
    } catch (error) {
      console.error('Failed to load Google Maps:', error);

      if (loadAttempts < 1) {
        setLoadAttempts(prev => prev + 1);
        setStatus(`Retrying Google Maps load (attempt ${loadAttempts + 1})...`);
        setTimeout(() => initializeMapSystem(), 2000);
      } else {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        setStatus(`❌ Google Maps failed: ${errorMsg}`);
        setIsBlocked(true);
      }
    }
  }, [apiKey, loadGoogleMapsScript, loadAttempts]);

  // Setup map event listeners
  const setupMapListeners = useCallback((map: google.maps.Map) => {
    map.addListener("click", async (mapsMouseEvent: google.maps.MapMouseEvent) => {
      if (!mapsMouseEvent.latLng) return;

      const location = mapsMouseEvent.latLng;
      setPendingLocation(location);

      // Add visual marker for the clicked location
      addPendingMarker(
        { lat: location.lat(), lng: location.lng() },
        map
      );

      setShowTaskInput(true);
    });
  }, [addPendingMarker]);

  // Initialize the actual map once Google Maps is loaded
  const initializeActualMap = useCallback(async () => {
    if (!isGoogleLoaded) {
      return;
    }

    if (!window.google?.maps?.Map) {
      setStatus('Waiting for Google Maps API to be ready...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (!window.google?.maps?.Map) {
        setStatus('Google Maps API still not ready');
        return;
      }
    }

    try {
      const userLocation = await getCurrentLocation();
      const map = initMap(userLocation);

      if (map) {
        console.log('🗺️ Map initialized, setting up...');
        setupMapListeners(map);
        watchLocation(map);

        // Load tasks and THEN add markers
        const loadedTasks = await loadTasks();
        console.log('📋 Tasks loaded:', loadedTasks.length);

        if (loadedTasks.length > 0) {
          console.log('📍 Adding initial task markers');
          addTaskMarkers(loadedTasks, map);
        }

        setStatus(`✅ Map loaded successfully ${useFallbackMarkers ? '(using fallback markers)' : ''}`);
      }
    } catch (error) {
      console.warn('Using default location:', error);
      const map = initMap({ lat: 12.3325, lng: 75.0962 });

      if (map) {
        console.log('🗺️ Default map initialized');
        setupMapListeners(map);
        const loadedTasks = await loadTasks();
        console.log('📋 Tasks loaded for default map:', loadedTasks.length);

        if (loadedTasks.length > 0) {
          addTaskMarkers(loadedTasks, map);
        }

        setStatus(`✅ Map loaded with default location ${useFallbackMarkers ? '(using fallback markers)' : ''}`);
      }
    }
  }, [isGoogleLoaded, getCurrentLocation, initMap, watchLocation, loadTasks, addTaskMarkers, setupMapListeners, useFallbackMarkers]);

  // Handle task creation
  const handleTaskCreate = useCallback(async (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    if (!pendingLocation || !mapInstance) {
      showMessage("No location selected", 'error');
      return;
    }

    try {
      await createTask({
        ...taskData,
        lat: pendingLocation.lat(),
        lng: pendingLocation.lng(),
      });

      // Refresh task markers
      const updatedTasks = await loadTasks();
      addTaskMarkers(updatedTasks, mapInstance);

      // Clear pending marker
      clearPendingMarker();

      showMessage(`Task to get ${taskData.quantity} ${taskData.name} added successfully!`, 'success');
      setShowTaskInput(false);
      setPendingLocation(null);
    } catch (error) {
      showMessage(`Failed to create task: ${(error as Error).message}`, 'error');
      throw error;
    }
  }, [pendingLocation, mapInstance, createTask, loadTasks, addTaskMarkers, clearPendingMarker, showMessage]);

  // Handle task cancellation
  const handleCancelTask = useCallback(() => {
    setShowTaskInput(false);
    setPendingLocation(null);
    clearPendingMarker();
  }, [clearPendingMarker]);

  // Effects
  useEffect(() => {
    initializeMapSystem();
  }, [initializeMapSystem]);

  useEffect(() => {
    if (isGoogleLoaded) {
      initializeActualMap();
    }
  }, [isGoogleLoaded, initializeActualMap]);

  // Update markers when tasks change
  useEffect(() => {
    console.log('🔄 Marker useEffect triggered:', {
      tasksCount: tasks.length,
      mapInstance: !!mapInstance,
      isGoogleLoaded,
      useFallbackMarkers
    });

    if (mapInstance && tasks.length > 0 && isGoogleLoaded) {
      console.log('✅ Conditions met, adding markers...');
      addTaskMarkers(tasks, mapInstance);
    }
  }, [tasks, mapInstance, isGoogleLoaded, addTaskMarkers]);

  useEffect(() => {
    if (error) {
      showMessage(error, 'error');
    }
  }, [error, showMessage]);

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Blocked overlay */}
      {isBlocked && (
        <div className="absolute inset-0 bg-yellow-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md text-center">
            <h2 className="text-xl font-bold text-yellow-800 mb-4">🚫 Map Loading Issues</h2>
            <p className="text-gray-700 mb-4">{status}</p>
            <ul className="text-left text-gray-600 mb-4 space-y-2">
              <li>• Check browser console for details</li>
              <li>• Disable ad blockers for this site</li>
              <li>• Ensure JavaScript is enabled</li>
              <li>• Check internet connection</li>
            </ul>
            <div className="space-x-2">
              <button
                onClick={() => window.location.reload()}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              >
                Retry
              </button>
              <button
                onClick={() => setIsBlocked(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Continue without map
              </button>
            </div>
          </div>
        </div>
      )}

      <MapControls
        authStatus={`Ready to track banana deliveries! 🍌 ${useFallbackMarkers ? '(Simple markers)' : ''}`}
        showTaskInput={showTaskInput}
        loading={loading}
        message={message}
        taskCount={tasks.length}
        onTaskCreate={handleTaskCreate}
        onCancelTask={handleCancelTask}
      />

      <MapView
        mapRef={mapRef}
        status={status}
        taskCount={tasks.length}
      />
    </div>
  );
}