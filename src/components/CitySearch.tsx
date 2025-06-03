
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface CitySearchProps {
  onSearch: (city: string) => void;
  isLoading: boolean;
}

const CitySearch = ({ onSearch, isLoading }: CitySearchProps) => {
  const [city, setCity] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto mb-8">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Enter city name..."
          value={city}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCity(e.target.value)}
          className="bg-white/20 border-white/30 text-white placeholder:text-white/60 text-lg"
          disabled={isLoading}
        />
        <Button 
          type="submit" 
          disabled={isLoading || !city.trim()}
          className="bg-white/20 hover:bg-white/30 text-white border-white/30 px-6"
        >
          <Search size={20} />
        </Button>
      </div>
    </form>
  );
};

export default CitySearch;
