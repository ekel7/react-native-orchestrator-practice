import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, Snackbar } from 'react-native-paper';
import { getWeatherForecastByLatLng } from '../services/weatherApi';
import { convertUnixToDate } from '../utils/dateUtils';
import useLocation from '../hooks/useLocation';
import type { ForecastItem, WeatherForecastResult } from '../types/weather';
import ForecastListItem from '../components/ForecastListItem';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const NETWORK_ERROR_PATTERNS = [
  'fetch',
  'network',
  'Failed to fetch',
  'internet',
  'Network request failed',
] as const;

function isNetworkError(message: string): boolean {
  const lower = message.toLowerCase();
  return NETWORK_ERROR_PATTERNS.some((pattern) =>
    lower.includes(pattern.toLowerCase()),
  );
}

export default function ForecastScreen() {
  const { lat, lon, permission, error: locationError } = useLocation();
  const [data, setData] = useState<WeatherForecastResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  useEffect(() => {
    if (permission === 'granted' && lat !== null && lon !== null) {
      loadForecast();
    }
  }, [permission, lat, lon]);

  async function loadForecast() {
    if (lat === null || lon === null) return;
    setLoading(true);
    setError(null);
    setData(null);
    setSnackbarVisible(false);
    try {
      const result = await getWeatherForecastByLatLng(lat, lon);
      setData(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load forecast';
      setError(message);
      if (isNetworkError(message)) {
        setSnackbarVisible(true);
      }
    } finally {
      setLoading(false);
    }
  }

  if (permission === 'unknown') {
    return <LoadingSpinner />;
  }

  if (permission === 'denied') {
    return (
      <View style={styles.container}>
        <ErrorMessage message={locationError || 'Location permission denied. Please enable it in settings.'} />
      </View>
    );
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      {error ? (
        <ErrorMessage message={error} onRetry={loadForecast} />
      ) : (
        <>
          {data && (
            <Text variant="headlineSmall" style={styles.cityName}>
              {data.city.name}
            </Text>
          )}
          <FlatList
            data={data?.list || []}
            keyExtractor={(item) => item.dt_txt}
            renderItem={({ item }: { item: ForecastItem }) => (
              <ForecastListItem
                date={convertUnixToDate(item.dt)}
                description={item.weather[0]?.description || 'No description'}
                temp={item.main.temp}
              />
            )}
            ListEmptyComponent={
              <Text style={styles.empty}>No forecast data available</Text>
            }
          />
        </>
      )}

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={4000}
      >
        No internet connection. Please check your network.
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  cityName: { textAlign: 'center', marginTop: 16, marginBottom: 8 },
  empty: { textAlign: 'center', marginTop: 32 },
});
