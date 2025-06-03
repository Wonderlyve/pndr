
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import ApiKeyInput from './ApiKeyInput';
import CitySearch from './CitySearch';
import WeatherCard from './WeatherCard';
import ForecastCard from './ForecastCard';

const WeatherDashboard = () => {
  const [apiKey, setApiKey] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [unit, setUnit] = useState<'C' | 'F'>('C');
  const { toast } = useToast();

  const getWeatherBackground = () => {
    if (!weatherData) {
      return 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600';
    }

    const condition = weatherData.weather[0].main.toLowerCase();
    switch (condition) {
      case 'clear':
        return 'bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500';
      case 'clouds':
        return 'bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600';
      case 'rain':
        return 'bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800';
      case 'snow':
        return 'bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400';
      default:
        return 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600';
    }
  };

  const fetchWeatherData = useCallback(async (city: string) => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your OpenWeather API key first.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      // Fetch current weather
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      
      if (!weatherResponse.ok) {
        throw new Error('City not found');
      }
      
      const weatherResult = await weatherResponse.json();
      
      // Fetch 5-day forecast
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
      );
      
      if (!forecastResponse.ok) {
        throw new Error('Forecast data not available');
      }
      
      const forecastResult = await forecastResponse.json();
      
      setWeatherData(weatherResult);
      setForecastData(forecastResult);
      
      toast({
        title: "Weather Data Loaded",
        description: `Weather information for ${weatherResult.name} has been loaded successfully.`,
      });
      
    } catch (error) {
      console.error('Error fetching weather data:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch weather data. Please check your API key and city name.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [apiKey, toast]);

  const toggleUnit = () => {
    setUnit(unit === 'C' ? 'F' : 'C');
  };

  return (
    <div className={`min-h-screen transition-all duration-1000 ${getWeatherBackground()}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4">Weather Dashboard</h1>
          <p className="text-xl text-white/80">Get current weather and 5-day forecast for any city</p>
        </div>

        <ApiKeyInput onApiKeyChange={setApiKey} />
        
        {apiKey && (
          <>
            <CitySearch onSearch={fetchWeatherData} isLoading={loading} />
            
            {weatherData && (
              <div className="flex justify-center mb-6">
                <Button
                  onClick={toggleUnit}
                  variant="outline"
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                >
                  Switch to °{unit === 'C' ? 'F' : 'C'}
                </Button>
              </div>
            )}
            
            {loading && (
              <div className="text-center text-white text-xl">Loading weather data...</div>
            )}
            
            {weatherData && <WeatherCard weather={weatherData} unit={unit} />}
            {forecastData && <ForecastCard forecast={forecastData} unit={unit} />}
          </>
        )}
      </div>
    </div>
  );
};

export default WeatherDashboard;
