import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { getWeatherForecastByLatLng } from '../services/weatherApi';
import { convertUnixToDate } from '../utils/dateUtils';
import useLocation from '../hooks/useLocation';
import type { ForecastItem, WeatherForecastResult } from '../types/weather';
import ForecastListItem from '../components/ForecastListItem';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function ForecastScreen() {
  const { lat, lon, permission, error: locationError } = useLocation();
  const [data, setData] = useState<WeatherForecastResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    try {
      const result = await getWeatherForecastByLatLng(lat, lon);
      setData(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load forecast';
      setError(message);
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

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <View style={styles.container}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  cityName: { textAlign: 'center', marginTop: 16, marginBottom: 8 },
  empty: { textAlign: 'center', marginTop: 32 },
});
