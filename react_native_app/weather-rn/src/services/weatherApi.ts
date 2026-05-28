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

async function parseError(response: Response): Promise<Error> {
  try {
    const body = await response.json();
    const message: string =
      typeof body?.message === 'string' ? body.message : response.statusText;
    return new Error(`OpenWeather API error: ${message}`);
  } catch {
    return new Error(
      `OpenWeather API error: ${response.status} ${response.statusText}`,
    );
  }
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
      throw await parseError(response);
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
  lat: number,
  lon: number,
  units: string = 'metric',
): Promise<WeatherResult> {
  try {
    const apiKey = getApiKey();
    const response = await fetch(
      `${BASE_URL}weather?lat=${encodeURIComponent(String(lat))}&lon=${encodeURIComponent(String(lon))}&appid=${apiKey}&units=${units}`,
    );

    if (!response.ok) {
      throw await parseError(response);
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
  lat: number,
  lon: number,
  units: string = 'metric',
): Promise<WeatherForecastResult> {
  try {
    const apiKey = getApiKey();
    const response = await fetch(
      `${BASE_URL}forecast?lat=${encodeURIComponent(String(lat))}&lon=${encodeURIComponent(String(lon))}&appid=${apiKey}&units=${units}`,
    );

    if (!response.ok) {
      throw await parseError(response);
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
