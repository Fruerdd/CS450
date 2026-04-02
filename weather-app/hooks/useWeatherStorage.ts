import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'weather_cache';

export interface WeatherData {
  cityName: string;
  country: string;
  stationName: string;
  temperature: number;
  description: string;
  icon: string;
}

export const useWeatherStorage = () => {
  const getCachedWeather = async (city: string): Promise<WeatherData | null> => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const cache: Record<string, WeatherData> = JSON.parse(raw);
      return cache[city.toLowerCase()] || null;
    } catch {
      return null;
    }
  };

  const cacheWeather = async (city: string, data: WeatherData): Promise<void> => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const cache: Record<string, WeatherData> = raw ? JSON.parse(raw) : {};
      cache[city.toLowerCase()] = data;
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
    } catch {}
  };

  return { getCachedWeather, cacheWeather };
};
