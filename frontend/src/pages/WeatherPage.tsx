import React, { useState, useEffect } from 'react';
import {
  CloudSun, Sun, CloudRain, Wind, Droplets, Compass,
  MapPin, AlertCircle, RefreshCw, CheckCircle, ShieldAlert
} from 'lucide-react';
import api from '../services/api';
import { WeatherData } from '../types';
import { useAuth } from '../context/AuthContext';

export const WeatherPage: React.FC = () => {
  const { user } = useAuth();
  const [district, setDistrict] = useState(user?.district || 'Ludhiana');
  const [supportedDistricts, setSupportedDistricts] = useState<any[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  const fetchDistricts = async () => {
    try {
      const res = await api.get('/weather/districts');
      setSupportedDistricts(res.data);
    } catch {
      // Ignored
    }
  };

  const fetchWeather = async (targetDistrict: string, lat?: number, lon?: number) => {
    setIsLoading(true);
    setGpsError(null);
    try {
      let url = `/weather?district=${encodeURIComponent(targetDistrict)}`;
      if (lat !== undefined && lon !== undefined) {
        url += `&lat=${lat}&lon=${lon}`;
      }
      const res = await api.get(url);
      setWeather(res.data);
      if (res.data.district) {
        setDistrict(res.data.district);
      }
    } catch (err) {
      console.error('Failed to load weather:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDistricts();
    fetchWeather(district);
  }, []);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }

    setGpsLoading(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsLoading(false);
        fetchWeather('My GPS Coordinates', pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        setGpsLoading(false);
        setGpsError('Location permission denied or unavailable. Please select your district from the dropdown.');
      },
      { timeout: 8000 }
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#176B3A] mb-1">
            <CloudSun className="w-4 h-4" />
            <span>Meteorological Agricultural Advisories</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Localized Farm Weather & Spraying Advisory
          </h1>
          <p className="text-xs sm:text-sm text-gray-600">
            Real-time conditions, 7-day agricultural forecasts, and spray-suitability recommendations.
          </p>
        </div>

        {/* Location Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={district}
            onChange={(e) => {
              setDistrict(e.target.value);
              fetchWeather(e.target.value);
            }}
            className="px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-800 shadow-2xs focus:ring-2 focus:ring-[#176B3A]"
          >
            {supportedDistricts.map((d) => (
              <option key={d.key} value={d.name}>
                {d.name} ({d.state})
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={gpsLoading}
            className="px-3 py-2 bg-emerald-50 border border-emerald-200 text-[#176B3A] hover:bg-emerald-100 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs disabled:opacity-50"
          >
            <Compass className={`w-3.5 h-3.5 ${gpsLoading ? 'animate-spin' : ''}`} />
            <span>{gpsLoading ? 'Locating...' : 'Use GPS'}</span>
          </button>
        </div>
      </div>

      {gpsError && (
        <div className="p-3 bg-amber-50 border border-amber-200 text-xs text-amber-800 rounded-2xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{gpsError}</span>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-20 text-xs text-gray-400">Retrieving meteorological telemetry...</div>
      ) : weather ? (
        <div className="space-y-6">
          {/* Main Current Weather Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-100">
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#176B3A] uppercase tracking-wider">
                  Live Meteorological Telemetry
                </span>
                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                  <span>{weather.district}, {weather.state}</span>
                </h2>
                <p className="text-xs text-gray-400">
                  Latitude: {weather.latitude.toFixed(2)}° • Longitude: {weather.longitude.toFixed(2)}°
                </p>
              </div>

              <div className="flex items-center gap-6">
                <div>
                  <span className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">
                    {weather.current_temperature}°C
                  </span>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Feels like {weather.feels_like}°C • {weather.weather_condition}
                  </p>
                </div>
              </div>
            </div>

            {/* Weather Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                  <Droplets className="w-4 h-4 text-blue-500" />
                  <span>Relative Humidity</span>
                </div>
                <span className="text-xl font-bold text-gray-900">{weather.humidity}%</span>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                  <CloudRain className="w-4 h-4 text-blue-600" />
                  <span>Rain Probability</span>
                </div>
                <span className="text-xl font-bold text-gray-900">{weather.rain_probability}%</span>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                  <Wind className="w-4 h-4 text-teal-600" />
                  <span>Wind Velocity</span>
                </div>
                <span className="text-xl font-bold text-gray-900">{weather.wind_speed} km/h</span>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>Condition</span>
                </div>
                <span className="text-base font-bold text-gray-900 truncate block">
                  {weather.weather_condition}
                </span>
              </div>
            </div>

            {/* Practical Agronomic Advisories */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase tracking-wider">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Foliar Spraying Feasibility</span>
                </div>
                <p className="text-xs text-emerald-950 font-semibold">
                  Status: <span className="underline">{weather.spraying_suitability}</span>
                </p>
                <p className="text-xs text-emerald-900 leading-relaxed">
                  {weather.agricultural_advisory}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2">
                <div className="flex items-center gap-2 text-blue-900 font-bold text-xs uppercase tracking-wider">
                  <Droplets className="w-4 h-4 text-blue-600" />
                  <span>Irrigation Scheduling Guidance</span>
                </div>
                <p className="text-xs text-blue-950 font-semibold">
                  Water Management Advisory
                </p>
                <p className="text-xs text-blue-900 leading-relaxed">
                  {weather.irrigation_advice}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
              <span>Source: {weather.source}</span>
              <span>Last updated: {weather.last_updated}</span>
            </div>
          </div>

          {/* 7-Day Agricultural Forecast Cards */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">
              7-Day Agricultural Forecast
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {weather.forecast.map((day, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 text-center space-y-2 hover:bg-emerald-50/50 transition-colors"
                >
                  <span className="text-xs font-bold text-gray-800 block">{day.day_name}</span>
                  <span className="text-[10px] text-gray-400 block">{day.date.slice(5)}</span>

                  <div className="py-1">
                    <Sun className="w-6 h-6 text-amber-500 mx-auto" />
                  </div>

                  <div className="text-xs font-black text-gray-900">
                    {Math.round(day.temp_max)}° / <span className="text-gray-400 font-normal">{Math.round(day.temp_min)}°</span>
                  </div>

                  <div className="text-[10px] text-blue-600 font-semibold">
                    {day.precipitation_prob}% rain
                  </div>
                  <span className="text-[9px] text-gray-500 block truncate">
                    {day.weather_condition}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
