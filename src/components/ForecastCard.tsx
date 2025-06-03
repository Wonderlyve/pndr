
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CloudRain, CloudSnow, CloudSun, Sun } from 'lucide-react';

interface ForecastData {
  list: Array<{
    dt: number;
    main: {
      temp: number;
      temp_min: number;
      temp_max: number;
    };
    weather: Array<{
      main: string;
      description: string;
    }>;
    dt_txt: string;
  }>;
}

interface ForecastCardProps {
  forecast: ForecastData;
  unit: 'C' | 'F';
}

const ForecastCard = ({ forecast, unit }: ForecastCardProps) => {
  const getWeatherIcon = (condition: string, size = 24) => {
    const iconProps = { size, className: "text-white" };
    switch (condition.toLowerCase()) {
      case 'clear':
        return <Sun {...iconProps} className="text-yellow-300" />;
      case 'clouds':
        return <CloudSun {...iconProps} className="text-gray-300" />;
      case 'rain':
        return <CloudRain {...iconProps} className="text-blue-300" />;
      case 'snow':
        return <CloudSnow {...iconProps} className="text-white" />;
      default:
        return <CloudSun {...iconProps} className="text-gray-300" />;
    }
  };

  const convertTemp = (temp: number) => {
    if (unit === 'F') {
      return Math.round((temp * 9/5) + 32);
    }
    return Math.round(temp);
  };

  const groupByDay = (list: ForecastData['list']) => {
    const groups: { [key: string]: ForecastData['list'] } = {};
    list.slice(0, 40).forEach(item => { // 5 days * 8 items per day
      const date = new Date(item.dt * 1000).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(item);
    });
    return groups;
  };

  const getDailyForecast = () => {
    const grouped = groupByDay(forecast.list);
    return Object.entries(grouped).slice(0, 5).map(([date, items]) => {
      const temps = items.map(item => item.main.temp);
      const minTemp = Math.min(...temps);
      const maxTemp = Math.max(...temps);
      const mainWeather = items[Math.floor(items.length / 2)].weather[0];
      
      return {
        date: new Date(date),
        minTemp,
        maxTemp,
        weather: mainWeather,
        items
      };
    });
  };

  const dailyForecast = getDailyForecast();

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white/10 backdrop-blur-md border-white/20">
      <CardHeader>
        <CardTitle className="text-2xl text-white text-center">5-Day Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {dailyForecast.map((day, index) => (
            <div key={index} className="bg-white/10 rounded-lg p-4 text-center">
              <div className="text-white font-semibold mb-2">
                {index === 0 ? 'Today' : day.date.toLocaleDateString('en', { weekday: 'short' })}
              </div>
              <div className="flex justify-center mb-3">
                {getWeatherIcon(day.weather.main, 32)}
              </div>
              <div className="text-white/80 text-sm mb-2 capitalize">
                {day.weather.description}
              </div>
              <div className="text-white">
                <div className="font-bold">{convertTemp(day.maxTemp)}°</div>
                <div className="text-white/70 text-sm">{convertTemp(day.minTemp)}°</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ForecastCard;
