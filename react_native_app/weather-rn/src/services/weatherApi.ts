import type { WeatherResult, WeatherForecastResult } from '../types/weather';

const BASE_URL = 'https://api.openweathermap.org/data/2.5/';

function getApiKey(): string {
  const key = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;
  if (!key) {
    throw new Error(
      'Missing EXPO_PUBLIC_OPENWEATHER_API_KEY environment variable',
    );
  }
  return key;
}

export async function getWeatherByCity(
  city: string,
  units: string = 'metric',
): Promise<WeatherResult> {
  try {
    const apiKey = getApiKey();
    const response = await fetch(
      `${BASE_URL}weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=${units}`,
    );

    if (!response.ok) {
      throw new Error(
        `OpenWeather API error: ${response.status} ${response.statusText}`,
      );
    }

    const data: WeatherResult = await response.json();
    return data;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('Failed to parse weather data');
    }
    throw error;
  }
}

export async function getWeatherByLatLng(
  lat: string,
  lon: string,
  units: string = 'metric',
): Promise<WeatherResult> {
  try {
    const apiKey = getApiKey();
    const response = await fetch(
      `${BASE_URL}weather?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&appid=${apiKey}&units=${units}`,
    );

    if (!response.ok) {
      throw new Error(
        `OpenWeather API error: ${response.status} ${response.statusText}`,
      );
    }

    const data: WeatherResult = await response.json();
    return data;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('Failed to parse weather data');
    }
    throw error;
  }
}

export async function getWeatherForecastByLatLng(
  lat: string,
  lon: string,
  units: string = 'metric',
): Promise<WeatherForecastResult> {
  try {
    const apiKey = getApiKey();
    const response = await fetch(
      `${BASE_URL}forecast?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&appid=${apiKey}&units=${units}`,
    );

    if (!response.ok) {
      throw new Error(
        `OpenWeather API error: ${response.status} ${response.statusText}`,
      );
    }

    const data: WeatherForecastResult = await response.json();
    return data;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('Failed to parse weather data');
    }
    throw error;
  }
}
