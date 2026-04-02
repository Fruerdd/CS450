import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  SafeAreaView,
  StatusBar,
  Keyboard,
  ScrollView,
  Platform,
} from 'react-native';
import { WEATHER_API_KEY, WEATHER_BASE_URL, WEATHER_ICON_URL } from '@/constants/Weather';
import { useWeatherStorage, WeatherData } from '@/hooks/useWeatherStorage';

export default function WeatherScreen() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { getCachedWeather, cacheWeather } = useWeatherStorage();

  const handleSearch = useCallback(async () => {
    const trimmed = city.trim();
    if (!trimmed) return;

    Keyboard.dismiss();
    setLoading(true);
    setError('');
    setWeather(null);

    // 1. Check local cache first
    const cached = await getCachedWeather(trimmed);
    if (cached) {
      setWeather(cached);
      setLoading(false);
      return;
    }

    // 2. Fetch from OpenWeatherMap API
    try {
      const url = `${WEATHER_BASE_URL}?q=${encodeURIComponent(trimmed)}&appid=${WEATHER_API_KEY}&units=metric`;
      const response = await fetch(url);

      if (response.status === 404) {
        setError(`City "${trimmed}" not found.\nPlease check the spelling and try again.`);
        setLoading(false);
        return;
      }

      if (!response.ok) {
        setError('Something went wrong. Please try again.');
        setLoading(false);
        return;
      }

      const data = await response.json();

      const weatherData: WeatherData = {
        cityName: data.name,
        country: data.sys.country,
        stationName: data.base,
        temperature: Math.round(data.main.temp),
        description: data.weather[0].description,
        icon: data.weather[0].icon,
      };

      // 3. Save to cache for next time
      await cacheWeather(trimmed, weatherData);
      setWeather(weatherData);
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, [city, getCachedWeather, cacheWeather]);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0D1B2A" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerEmoji}>🌤</Text>
          <Text style={styles.headerTitle}>WeatherNow</Text>
          <Text style={styles.headerSub}>REAL-TIME CITY WEATHER</Text>
        </View>

        {/* Search Box */}
        <View style={styles.searchBox}>
          <Text style={styles.searchLabel}>Enter city name and press search button</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter city name..."
            placeholderTextColor="#5A6A7A"
            value={city}
            onChangeText={setCity}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="words"
          />
          <TouchableOpacity
            style={[styles.searchBtn, (!city.trim() || loading) && styles.searchBtnDisabled]}
            onPress={handleSearch}
            activeOpacity={0.85}
            disabled={!city.trim() || loading}
          >
            {loading
              ? <ActivityIndicator color="#FFFFFF" size="small" />
              : <Text style={styles.searchBtnText}>SEARCH</Text>
            }
          </TouchableOpacity>
        </View>

        {/* Error */}
        {!!error && !loading && (
          <View style={styles.errorCard}>
            <Text style={styles.errorEmoji}>⚠️</Text>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Weather Card */}
        {weather && !loading && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cityText}>
                {weather.cityName}
                <Text style={styles.countryText}>  {weather.country}</Text>
              </Text>
              <Text style={styles.stationText}>{weather.stationName}</Text>
            </View>

            <View style={styles.cardBody}>
              <Text style={styles.tempText}>{weather.temperature}°C</Text>
              <Image
                source={{ uri: WEATHER_ICON_URL(weather.icon) }}
                style={styles.icon}
                resizeMode="contain"
              />
              <Text style={styles.descText}>{weather.description}</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0D1B2A',
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingBottom: 48,
  },

  // Header
  header: {
    alignItems: 'center',
    paddingTop: 52,
    paddingBottom: 36,
  },
  headerEmoji: {
    fontSize: 52,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: '700',
    color: '#E8F4FD',
    letterSpacing: 1.5,
    fontFamily: Platform.OS === 'ios' ? 'Trebuchet MS' : 'sans-serif-condensed',
  },
  headerSub: {
    fontSize: 11,
    color: '#4A6FA5',
    marginTop: 6,
    letterSpacing: 2,
  },

  // Search
  searchBox: {
    backgroundColor: '#152535',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#1E3A5F',
    gap: 12,
  },
  searchLabel: {
    color: '#7B9CBF',
    fontSize: 13,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  input: {
    backgroundColor: '#0D1B2A',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 16,
    color: '#E8F4FD',
    borderWidth: 1.5,
    borderColor: '#1E3A5F',
  },
  searchBtn: {
    backgroundColor: '#1A6EBD',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    shadowColor: '#1A6EBD',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  searchBtnDisabled: {
    backgroundColor: '#1E3A5F',
    shadowOpacity: 0,
    elevation: 0,
  },
  searchBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 3,
  },

  // Error
  errorCard: {
    backgroundColor: '#2A1515',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#5C2020',
    marginBottom: 16,
    gap: 8,
  },
  errorEmoji: {
    fontSize: 26,
  },
  errorText: {
    color: '#FF7B7B',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },

  // Weather Card
  card: {
    backgroundColor: '#152535',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1E3A5F',
    shadowColor: '#1A6EBD',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  cardHeader: {
    backgroundColor: '#1A6EBD',
    paddingHorizontal: 24,
    paddingVertical: 20,
    alignItems: 'center',
  },
  cityText: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'Trebuchet MS' : 'sans-serif-condensed',
  },
  countryText: {
    fontSize: 20,
    fontWeight: '400',
    color: '#A8D4F5',
  },
  stationText: {
    fontSize: 13,
    color: '#A8D4F5',
    marginTop: 4,
    textTransform: 'capitalize',
    letterSpacing: 0.5,
  },
  cardBody: {
    alignItems: 'center',
    paddingVertical: 36,
    gap: 4,
  },
  tempText: {
    fontSize: 72,
    fontWeight: '200',
    color: '#E8F4FD',
    lineHeight: 80,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif-light',
  },
  icon: {
    width: 88,
    height: 88,
  },
  descText: {
    fontSize: 16,
    color: '#7B9CBF',
    textTransform: 'capitalize',
    letterSpacing: 0.5,
    marginTop: 4,
  },
});