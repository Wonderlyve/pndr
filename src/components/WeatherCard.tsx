
import { Card, CardContent } from '@/components/ui/card';
import { CloudRain, CloudSnow, CloudSun, Sun } from 'lucide-react';

interface WeatherData {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
  name: string;
  sys: {
    country: string;
  };
}

interface WeatherCardProps {
  weather: WeatherData;
  unit: 'C' | 'F';
}

const WeatherCard = ({ weather, unit }: WeatherCardProps) => {
  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear':
        return <Sun size={48} className="text-yellow-300" />;
      case 'clouds':
        return <CloudSun size={48} className="text-gray-300" />;
      case 'rain':
        return <CloudRain size={48} className="text-blue-300" />;
      case 'snow':
        return <CloudSnow size={48} className="text-white" />;
      default:
        return <CloudSun size={48} className="text-gray-300" />;
    }
  };

  const convertTemp = (temp: number) => {
    if (unit === 'F') {
      return Math.round((temp * 9/5) + 32);
    }
    return Math.round(temp);
  };

  const convertSpeed = (speed: number) => {
    // Convert m/s to km/h or mph based on unit
    if (unit === 'F') {
      return Math.round(speed * 2.237); // to mph
    }
    return Math.round(speed * 3.6); // to km/h
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-white/10 backdrop-blur-md border-white/20 mb-8">
      <CardContent className="p-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">
            {weather.name}, {weather.sys.country}
          </h2>
          <p className="text-white/80 text-lg capitalize">
            {weather.weather[0].description}
          </p>
        </div>

        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-6">
            {getWeatherIcon(weather.weather[0].main)}
            <div className="text-center">
              <div className="text-6xl font-bold text-white">
                {convertTemp(weather.main.temp)}°{unit}
              </div>
              <div className="text-white/80">
                Feels like {convertTemp(weather.main.feels_like)}°{unit}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 text-center">
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold text-white">{weather.main.humidity}%</div>
            <div className="text-white/80 text-sm">Humidity</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold text-white">{weather.main.pressure} hPa</div>
            <div className="text-white/80 text-sm">Pressure</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold text-white">
              {convertSpeed(weather.wind.speed)} {unit === 'F' ? 'mph' : 'km/h'}
            </div>
            <div className="text-white/80 text-sm">Wind Speed</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
