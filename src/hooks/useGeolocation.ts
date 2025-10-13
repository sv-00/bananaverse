// hooks/useGeolocation.ts
import { useState, useRef, useCallback } from 'react';

export function useGeolocation() {
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [locationError, setLocationError] = useState<string | null>(null);
    const liveMarkerRef = useRef<google.maps.Marker | null>(null);

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

    const getGeolocationError = useCallback((error: GeolocationPositionError): string => {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                return 'Location permission denied';
            case error.POSITION_UNAVAILABLE:
                return 'Location information unavailable';
            case error.TIMEOUT:
                return 'Location request timed out';
            default:
                return 'Unknown location error';
        }
    }, []);

    const getCurrentLocation = useCallback((): Promise<{ lat: number; lng: number }> => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const location = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    setUserLocation(location);
                    resolve(location);
                },
                (error) => {
                    const errorMessage = getGeolocationError(error);
                    setLocationError(errorMessage);
                    reject(new Error(errorMessage));
                },
                { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
            );
        });
    }, [getGeolocationError]);

    const watchLocation = useCallback((map: google.maps.Map) => {
        if (!navigator.geolocation) return;

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const location = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                setUserLocation(location);

                // Update live location marker with original design
                if (liveMarkerRef.current) {
                    liveMarkerRef.current.setPosition(location);
                } else {
                    // Create live location marker with original design
                    liveMarkerRef.current = new google.maps.Marker({
                        position: location,
                        map: map,
                        title: 'Your location',
                        icon: {
                            url: getLiveLocationIconUrl(),
                            scaledSize: new google.maps.Size(30, 30),
                            anchor: new google.maps.Point(15, 15)
                        }
                    });
                }
            },
            (error) => {
                setLocationError(getGeolocationError(error));
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );

        // Return cleanup function
        return () => {
            navigator.geolocation.clearWatch(watchId);
        };
    }, [getGeolocationError, getLiveLocationIconUrl]);

    return {
        userLocation,
        locationError,
        liveMarkerRef,
        getCurrentLocation,
        watchLocation
    };
}