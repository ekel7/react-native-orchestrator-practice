import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { getWeatherByCity } from '../services/weatherApi';
import { CITIES } from '../constants/cities';
import { convertUnixToHour } from '../utils/dateUtils';
import type { WeatherResult } from '../types/weather';
import CitySelector from '../components/CitySelector';
import MetricRow from '../components/MetricRow';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function CurrentWeatherScreen() {
  const [city, setCity] = useState<string>(CITIES[0]); // Dhaka
  const [data, setData] = useState<WeatherResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadWeather();
  }, [city]);

  async function loadWeather() {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const result = await getWeatherByCity(city);
      setData(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load weather';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <CitySelector cities={CITIES} selected={city} onSelect={setCity} />

      {loading && <LoadingSpinner />}

      {error && <ErrorMessage message={error} />}

      {data && (
        <>
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="headlineMedium">{data.name}, {data.main.temp}°C</Text>
              <Text variant="bodyLarge">Max: {data.main.temp_max}°C | Min: {data.main.temp_min}°C</Text>
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Content>
              <MetricRow label="Pressure" value={`${data.main.pressure} hPa`} />
              <MetricRow label="Humidity" value={`${data.main.humidity}%`} />
              <MetricRow label="Wind" value={`${data.wind.speed} m/s, ${data.wind.deg}°`} />
              <MetricRow label="Sunrise" value={convertUnixToHour(data.sys.sunrise)} />
              <MetricRow label="Sunset" value={convertUnixToHour(data.sys.sunset)} />
            </Card.Content>
          </Card>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: { marginVertical: 8 },
});
