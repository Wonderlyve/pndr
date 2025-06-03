
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Key } from 'lucide-react';

interface ApiKeyInputProps {
  onApiKeyChange: (apiKey: string) => void;
}

const ApiKeyInput = ({ onApiKeyChange }: ApiKeyInputProps) => {
  const [apiKey, setApiKey] = useState('');
  const [isStored, setIsStored] = useState(false);

  useEffect(() => {
    const storedKey = localStorage.getItem('openweather_api_key');
    if (storedKey) {
      setApiKey(storedKey);
      setIsStored(true);
      onApiKeyChange(storedKey);
    }
  }, [onApiKeyChange]);

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem('openweather_api_key', apiKey.trim());
      setIsStored(true);
      onApiKeyChange(apiKey.trim());
    }
  };

  const handleClear = () => {
    localStorage.removeItem('openweather_api_key');
    setApiKey('');
    setIsStored(false);
    onApiKeyChange('');
  };

  return (
    <Card className="w-full max-w-md mx-auto mb-6 bg-white/10 backdrop-blur-md border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Key size={20} />
          OpenWeather API Key
        </CardTitle>
        <CardDescription className="text-white/80">
          Enter your API key to get weather data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            type="password"
            placeholder="Enter your API key"
            value={apiKey}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setApiKey(e.target.value)}
            className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
          />
          {isStored ? (
            <Button onClick={handleClear} variant="outline" className="bg-red-500/20 border-red-400/50 text-white hover:bg-red-500/30">
              Clear
            </Button>
          ) : (
            <Button onClick={handleSave} className="bg-blue-500/30 hover:bg-blue-500/50 text-white border-blue-400/50">
              Save
            </Button>
          )}
        </div>
        <div className="text-sm text-white/70">
          Don't have an API key?{' '}
          <a
            href="https://openweathermap.org/api"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-300 hover:text-blue-200 inline-flex items-center gap-1"
          >
            Get one here <ExternalLink size={12} />
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiKeyInput;
