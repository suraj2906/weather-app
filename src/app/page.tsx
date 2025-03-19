"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

// Weather condition icons mapping
const weatherIcons: Record<string, string> = {
  "01d": "/weather-icons/clear-day.svg",
  "01n": "/weather-icons/clear-night.svg",
  "02d": "/weather-icons/partly-cloudy-day.svg",
  "02n": "/weather-icons/partly-cloudy-night.svg",
  "03d": "/weather-icons/cloudy.svg",
  "03n": "/weather-icons/cloudy.svg",
  "04d": "/weather-icons/cloudy.svg",
  "04n": "/weather-icons/cloudy.svg",
  "09d": "/weather-icons/rain.svg",
  "09n": "/weather-icons/rain.svg",
  "10d": "/weather-icons/rain.svg",
  "10n": "/weather-icons/rain.svg",
  "11d": "/weather-icons/thunderstorm.svg",
  "11n": "/weather-icons/thunderstorm.svg",
  "13d": "/weather-icons/snow.svg",
  "13n": "/weather-icons/snow.svg",
  "50d": "/weather-icons/fog.svg",
  "50n": "/weather-icons/fog.svg",
};

// OpenWeatherMap API key from environment variable
const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
  };
  sys: {
    country: string;
  };
}

interface ForecastData {
  list: {
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      humidity: number;
    };
    weather: {
      id: number;
      main: string;
      description: string;
      icon: string;
    }[];
    dt_txt: string;
  }[];
}

export default function Home() {
  const [location, setLocation] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Function to fetch weather data
  const fetchWeather = async (searchLocation: string) => {
    setLoading(true);
    setError("");
    
    try {
      const weatherResponse = await fetch(
        `${BASE_URL}/weather?q=${searchLocation}&units=metric&appid=${API_KEY}`
      );
      
      if (!weatherResponse.ok) {
        throw new Error("Location not found. Please try another search term.");
      }
      
      const weatherData = await weatherResponse.json();
      setWeather(weatherData);
      
      // Fetch 5-day forecast
      const forecastResponse = await fetch(
        `${BASE_URL}/forecast?q=${searchLocation}&units=metric&appid=${API_KEY}`
      );
      
      if (!forecastResponse.ok) {
        throw new Error("Could not fetch forecast data.");
      }
      
      const forecastData = await forecastResponse.json();
      setForecast(forecastData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Function to get user's current location
  const getCurrentLocation = () => {
    setLoading(true);
    setError("");
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            const weatherResponse = await fetch(
              `${BASE_URL}/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
            );
            
            if (!weatherResponse.ok) {
              throw new Error("Could not fetch weather for your location.");
            }
            
            const weatherData = await weatherResponse.json();
            setWeather(weatherData);
            setLocation(weatherData.name);
            
            // Fetch 5-day forecast
            const forecastResponse = await fetch(
              `${BASE_URL}/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
            );
            
            if (!forecastResponse.ok) {
              throw new Error("Could not fetch forecast data.");
            }
            
            const forecastData = await forecastResponse.json();
            setForecast(forecastData);
          } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred");
          } finally {
            setLoading(false);
          }
        },
        (err) => {
          setError("Unable to retrieve your location. Please allow location access or enter a location manually.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
    }
  };

  // Function to handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location.trim()) {
      fetchWeather(location);
    }
  };

  // Function to format date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  // Function to get daily forecast (one entry per day)
  const getDailyForecast = () => {
    if (!forecast) return [];
    
    const dailyData: Record<string, any> = {};
    
    forecast.list.forEach(item => {
      const date = item.dt_txt.split(' ')[0];
      
      // Only keep the first entry for each day
      if (!dailyData[date]) {
        dailyData[date] = item;
      }
    });
    
    return Object.values(dailyData).slice(0, 5); // Return only 5 days
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 p-4 sm:p-8">
      <main className="max-w-4xl mx-auto bg-white/90 rounded-xl shadow-lg p-6 sm:p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-800">Weather Forecast</h1>
        
        <div className="mb-8">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter city, zip code, landmark, etc."
              className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              disabled={loading}
            >
              {loading ? "Loading..." : "Search"}
            </button>
            <button
              type="button"
              onClick={getCurrentLocation}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              disabled={loading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              Use My Location
            </button>
          </form>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {weather && (
          <div className="mb-8">
            <div className="bg-blue-50 rounded-xl p-6 shadow-md">
              <div className="flex flex-col sm:flex-row items-center justify-between">
                <div className="text-center sm:text-left mb-4 sm:mb-0">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {weather.name}, {weather.sys.country}
                  </h2>
                  <p className="text-gray-600">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  <div className="mt-4">
                    <p className="text-5xl font-bold text-blue-800">{Math.round(weather.main.temp)}°C</p>
                    <p className="text-gray-700 capitalize">{weather.weather[0].description}</p>
                  </div>
                </div>
                
                <div className="flex flex-col items-center">
                  <Image
                    src={weatherIcons[weather.weather[0].icon] || `/weather-icons/unknown.svg`}
                    alt={weather.weather[0].description}
                    width={100}
                    height={100}
                    className="mb-2"
                  />
                  <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-700">
                    <div className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 2a.75.75 0 01.75.75v7.5a.75.75 0 01-1.5 0v-7.5A.75.75 0 0110 2zM5.404 4.343a.75.75 0 010 1.06 6.5 6.5 0 109.192 0 .75.75 0 111.06-1.06 8 8 0 11-11.313 0 .75.75 0 011.06 0z" clipRule="evenodd" />
                      </svg>
                      Feels like: {Math.round(weather.main.feels_like)}°C
                    </div>
                    <div className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.5 17a4.5 4.5 0 01-1.44-8.765 4.5 4.5 0 018.302-3.046 3.5 3.5 0 014.504 4.272A4 4 0 0115 17H5.5zm3.75-2.75a.75.75 0 001.5 0V9.66l1.95 2.1a.75.75 0 101.1-1.02l-3.25-3.5a.75.75 0 00-1.1 0l-3.25 3.5a.75.75 0 101.1 1.02l1.95-2.1v4.59z" clipRule="evenodd" />
                      </svg>
                      Humidity: {weather.main.humidity}%
                    </div>
                    <div className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M14.24 14.24a4.5 4.5 0 01-6.36-6.36l4.24-4.24a6 6 0 108.49 8.49l-2.83 2.83a1.5 1.5 0 01-2.12 0l-.88-.88a1.5 1.5 0 010-2.12l.88-.88a1.5 1.5 0 012.12 0l.88.88a1.5 1.5 0 010 2.12l-4.24 4.24a.75.75 0 01-1.06 0l-.88-.88a.75.75 0 010-1.06l.88-.88z" clipRule="evenodd" />
                      </svg>
                      Pressure: {weather.main.pressure} hPa
                    </div>
                    <div className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.636 4.364a9 9 0 0112.728 0 .75.75 0 01-1.06 1.06A7.5 7.5 0 005.636 5.424a.75.75 0 01-1.06-1.06z" clipRule="evenodd" />
                        <path fillRule="evenodd" d="M2.121 2.121a.75.75 0 011.06 0 10.5 10.5 0 0114.14 0 .75.75 0 111.06-1.06 12 12 0 00-16.97 0 .75.75 0 010 1.06z" clipRule="evenodd" />
                      </svg>
                      Wind: {Math.round(weather.wind.speed * 3.6)} km/h
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {forecast && (
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">5-Day Forecast</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
              {getDailyForecast().map((day, index) => (
                <div key={index} className="bg-blue-50 rounded-lg p-4 shadow-md text-center">
                  <p className="font-semibold text-gray-800">{formatDate(day.dt)}</p>
                  <div className="flex justify-center my-2">
                    <Image
                      src={weatherIcons[day.weather[0].icon] || `/weather-icons/unknown.svg`}
                      alt={day.weather[0].description}
                      width={50}
                      height={50}
                    />
                  </div>
                  <p className="text-xl font-bold text-blue-800">{Math.round(day.main.temp)}°C</p>
                  <p className="text-sm text-gray-600 capitalize">{day.weather[0].description}</p>
                  <div className="mt-2 text-xs text-gray-600">
                    <p>Humidity: {day.main.humidity}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      
      <footer className="max-w-4xl mx-auto mt-8 text-center text-white text-sm">
        <p>Weather data provided by OpenWeatherMap</p>
        <p className="mt-1">© {new Date().getFullYear()} Weather App</p>
      </footer>
    </div>
  );
}
