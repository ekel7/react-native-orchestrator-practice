import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export interface LocationState {
  lat: number | null;
  lon: number | null;
  permission: 'granted' | 'denied' | 'unknown';
  error: string | null;
}

export default function useLocation(): LocationState {
  const [state, setState] = useState<LocationState>({
    lat: null,
    lon: null,
    permission: 'unknown',
    error: null,
  });

  useEffect(() => {
    async function getLocation() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setState((s) => ({ ...s, permission: 'denied', error: 'Location permission denied. Please enable it in settings.' }));
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        setState({
          lat: location.coords.latitude,
          lon: location.coords.longitude,
          permission: 'granted',
          error: null,
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to get location';
        setState((s) => ({ ...s, error: message }));
      }
    }

    getLocation();
  }, []);

  return state;
}
