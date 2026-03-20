// hooks/useGoogleMaps.ts
import { useState, useRef, useCallback } from 'react';

export function useGoogleMaps() {
    const [status, setStatus] = useState<string>('Loading...');
    const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
    const mapRef = useRef<HTMLDivElement>(null);
    const markersRef = useRef<google.maps.Marker[]>([]);
    const pendingMarkerRef = useRef<google.maps.Marker | null>(null);
    const [useFallbackMarkers, setUseFallbackMarkers] = useState(false);

    const loadGoogleMapsScript = useCallback((apiKey: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            if (window.google?.maps?.Map) {
                setStatus('Google Maps already loaded');
                resolve();
                return;
            }

            const existingScript = document.querySelector(`script[src*="maps.googleapis.com"]`);
            if (existingScript) {
                setStatus('Google Maps script already loading');
                const checkExisting = setInterval(() => {
                    if (window.google?.maps?.Map) {
                        clearInterval(checkExisting);
                        setStatus('Google Maps loaded from existing script');
                        resolve();
                    }
                }, 100);

                setTimeout(() => {
                    clearInterval(checkExisting);
                    if (!window.google?.maps?.Map) {
                        reject(new Error('Existing Google Maps script timeout'));
                    }
                }, 10000);
                return;
            }

            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=marker&loading=async`;
            script.async = true;
            script.defer = true;

            script.onload = () => {
                setStatus('Google Maps script loaded, waiting for API...');

                // Listen for auth errors (invalid key)
                const origError = console.error;
                const authErrorHandler = (...args: any[]) => {
                    const msg = args.join(' ');
                    if (msg.includes('InvalidKeyMapError') || msg.includes('ApiNotActivatedMapError')) {
                        setStatus('❌ Invalid Google Maps API key — check your NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in .env');
                    }
                    origError.apply(console, args);
                };
                console.error = authErrorHandler;

                const checkApi = setInterval(() => {
                    if (window.google?.maps?.Map) {
                        clearInterval(checkApi);
                        console.error = origError;
                        setStatus('Google Maps API fully ready');
                        resolve();
                    }
                }, 100);

                setTimeout(() => {
                    clearInterval(checkApi);
                    console.error = origError;
                    if (!window.google?.maps?.Map) {
                        reject(new Error('Google Maps API initialization timeout'));
                    }
                }, 15000);
            };

            script.onerror = () => {
                setStatus('Failed to load Google Maps script');
                reject(new Error('Failed to load Google Maps script'));
            };

            document.head.appendChild(script);
        });
    }, []);

    const initMap = useCallback((center: { lat: number; lng: number }): google.maps.Map | null => {
        if (!mapRef.current) {
            setStatus('Map container not ready');
            return null;
        }

        if (!window.google?.maps?.Map) {
            setStatus('Google Maps Map constructor not available');
            return null;
        }

        try {
            const map = new google.maps.Map(mapRef.current, {
                zoom: 15,
                center,
                mapId: 'DEMO_MAP_ID',
                disableDefaultUI: false,
                zoomControl: true,
                streetViewControl: true,
                fullscreenControl: true,
            });

            setMapInstance(map);
            setStatus('Map initialized successfully');
            return map;
        } catch (error) {
            console.error('Error initializing map:', error);
            setStatus('Error initializing map');
            return null;
        }
    }, []);

    // Original task marker SVG from your code
    const getTaskMarkerIconUrl = useCallback((isCompleted: boolean, isPendingNew: boolean, quantity: number = 1): string => {
        const emoji = isCompleted ? '✅' : '📦';
        const size = 60;
        const strokeWidth = 5;

        let backgroundColor;
        if (isPendingNew) {
            backgroundColor = '#4B0082';
        } else if (isCompleted) {
            backgroundColor = '#006400';
        } else {
            backgroundColor = '#990000';
        }

        const qtyRadius = 10;
        const qtyX = size - qtyRadius - 3;
        const qtyY = size - qtyRadius - 5;

        const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
        <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - strokeWidth}" fill="${backgroundColor}" stroke="#FFFFFF" stroke-width="${strokeWidth}"/>
        <text x="${size / 2}" y="${size / 2}" font-size="28" text-anchor="middle" dominant-baseline="central" fill="#FFFFFF">${emoji}</text>
        <circle cx="${qtyX}" cy="${qtyY}" r="${qtyRadius}" fill="#FFFFFF" stroke="#3B82F6" stroke-width="2"/>
        <text x="${qtyX}" y="${qtyY}" font-size="14" font-weight="bold" text-anchor="middle" dominant-baseline="central" fill="#1E3A8A">${quantity}</text>
      </svg>`;

        return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
    }, []);

    // Original live location SVG from your code
    const getLiveLocationIconUrl = useCallback((): string => {
        const size = 30;
        const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
        <circle cx="${size / 2}" cy="${size / 2}" r="12" fill="#FFFFFF" opacity="0.8" stroke="#3B82F6" stroke-width="2"/>
        <circle cx="${size / 2}" cy="${size / 2}" r="6" fill="#1D4ED8"/>
      </svg>`;
        return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
    }, []);

    // Add markers for tasks with original design
    const addTaskMarkers = useCallback((tasks: any[], map: google.maps.Map) => {
        console.log('🔄 Adding task markers:', tasks.length, 'tasks');

        // Clear existing markers
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];

        if (!tasks.length) {
            console.log('ℹ️ No tasks to display');
            return;
        }

        if (!map) {
            console.log('❌ Map not available for markers');
            return;
        }

        // Add new markers for each task with original design
        tasks.forEach((task, index) => {
            const markerNumber = index + 1;

            try {
                let marker: google.maps.Marker;

                if (!useFallbackMarkers) {
                    // Use original SVG marker design
                    marker = new google.maps.Marker({
                        position: { lat: task.lat, lng: task.lng },
                        map: map,
                        title: `${task.name} (${task.quantity})`,
                        icon: {
                            url: getTaskMarkerIconUrl(task.completed || false, false, task.quantity),
                            scaledSize: new google.maps.Size(60, 60),
                            anchor: new google.maps.Point(30, 60)
                        }
                    });
                } else {
                    // Use fallback marker
                    marker = new google.maps.Marker({
                        position: { lat: task.lat, lng: task.lng },
                        map: map,
                        title: `${task.name} (${task.quantity})`,
                        label: {
                            text: `${markerNumber}`,
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '12px',
                        },
                        icon: {
                            url: 'http://maps.google.com/mapfiles/ms/icons/package.png',
                            scaledSize: new google.maps.Size(32, 32),
                        }
                    });

                    // Add quantity as secondary marker
                    const quantityMarker = new google.maps.Marker({
                        position: { lat: task.lat + 0.0002, lng: task.lng + 0.0001 },
                        map: map,
                        label: {
                            text: `x${task.quantity}`,
                            color: '#8B4513',
                            fontWeight: 'bold',
                            fontSize: '10px',
                        },
                        icon: {
                            url: 'data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%221%22%20height%3D%221%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3C%2Fsvg%3E',
                            scaledSize: new google.maps.Size(1, 1),
                        }
                    });

                    markersRef.current.push(quantityMarker);
                }

                console.log(`✅ Marker ${markerNumber} created at:`, task.lat, task.lng);
                markersRef.current.push(marker);

                // Add info window with task details
                const infoWindow = new google.maps.InfoWindow({
                    content: `
            <div class="p-3 min-w-[200px]">
              <div class="flex items-center mb-2">
                <div class="w-6 h-6 bg-yellow-600 rounded flex items-center justify-center text-white text-sm font-bold mr-2">
                  ${markerNumber}
                </div>
                <h3 class="font-bold text-lg">${task.name}</h3>
              </div>
              <div class="space-y-1 text-sm">
                <p><span class="font-semibold">Quantity:</span> ${task.quantity}</p>
                <p><span class="font-semibold">Location:</span> ${task.lat.toFixed(4)}, ${task.lng.toFixed(4)}</p>
                <p class="text-xs text-gray-500 mt-2">Click elsewhere to close</p>
              </div>
            </div>
          `
                });

                marker.addListener('click', () => {
                    // Close any previously opened info window
                    markersRef.current.forEach(m => {
                        const iw = m.get('infoWindow');
                        if (iw) iw.close();
                    });

                    infoWindow.open(map, marker);
                    marker.set('infoWindow', infoWindow);
                });

            } catch (error) {
                console.error(`❌ Failed to create marker ${markerNumber}:`, error);
                if (!useFallbackMarkers) {
                    setUseFallbackMarkers(true);
                    console.log('🔄 Switching to fallback markers due to SVG rendering issues');
                    // Retry with fallback markers
                    addTaskMarkers(tasks, map);
                    return;
                }
            }
        });
    }, [useFallbackMarkers, getTaskMarkerIconUrl]);

    // Add pending location marker with original design
    const addPendingMarker = useCallback((location: { lat: number; lng: number }, map: google.maps.Map) => {
        // Clear existing pending marker
        if (pendingMarkerRef.current) {
            pendingMarkerRef.current.setMap(null);
        }

        try {
            if (!useFallbackMarkers) {
                // Use original pending marker design (purple with package emoji)
                pendingMarkerRef.current = new google.maps.Marker({
                    position: location,
                    map: map,
                    title: 'New Banana Delivery Location',
                    icon: {
                        url: getTaskMarkerIconUrl(false, true, 1), // isPendingNew = true
                        scaledSize: new google.maps.Size(60, 60),
                        anchor: new google.maps.Point(30, 60)
                    },
                    animation: google.maps.Animation.BOUNCE
                });
            } else {
                // Use fallback pending marker
                pendingMarkerRef.current = new google.maps.Marker({
                    position: location,
                    map: map,
                    title: 'New Banana Delivery Location',
                    label: {
                        text: '📦',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '16px',
                    },
                    icon: {
                        url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                        scaledSize: new google.maps.Size(40, 40),
                    },
                    animation: google.maps.Animation.BOUNCE
                });
            }

            // Add info window for pending marker
            const pendingInfoWindow = new google.maps.InfoWindow({
                content: `
          <div class="p-3 min-w-[200px]">
            <div class="flex items-center mb-2">
              <span class="text-2xl mr-2">📦</span>
              <h3 class="font-bold text-lg">New Delivery Location</h3>
            </div>
            <p class="text-sm text-gray-600">Click "Add Task" to create a banana delivery here!</p>
          </div>
        `
            });

            pendingMarkerRef.current.addListener('click', () => {
                pendingInfoWindow.open(map, pendingMarkerRef.current);
            });

        } catch (error) {
            console.error('❌ Failed to create pending marker, using fallback:', error);
            setUseFallbackMarkers(true);
            // Retry with fallback
            addPendingMarker(location, map);
        }
    }, [useFallbackMarkers, getTaskMarkerIconUrl]);

    // Clear pending marker
    const clearPendingMarker = useCallback(() => {
        if (pendingMarkerRef.current) {
            pendingMarkerRef.current.setMap(null);
            pendingMarkerRef.current = null;
        }
    }, []);

    return {
        status,
        setStatus,
        mapRef,
        mapInstance,
        initMap,
        loadGoogleMapsScript,
        addTaskMarkers,
        addPendingMarker,
        clearPendingMarker,
        useFallbackMarkers,
    };
}