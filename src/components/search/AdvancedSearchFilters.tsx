import { useState } from 'react';
import { Search, Calendar, DollarSign, X, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  startOfMonth, 
  endOfMonth, 
  subMonths, 
  addMonths, 
  format 
} from 'date-fns';

interface SearchFilters {
  destination: string;
  startDate: string;
  endDate: string;
  minBudget: string;
  maxBudget: string;
}

interface AdvancedSearchFiltersProps {
  onFilterChange: (filters: SearchFilters) => void;
  showCreateButton?: boolean;
}

const datePresets = [
  { label: 'All Time', value: 'all' },
  { label: 'This Month', value: 'this-month' },
  { label: 'Previous Month', value: 'prev-month' },
  { label: 'Next Month', value: 'next-month' },
  { label: 'Custom', value: 'custom' },
];

export const AdvancedSearchFilters = ({ 
  onFilterChange, 
  showCreateButton = true 
}: AdvancedSearchFiltersProps) => {
  const [filters, setFilters] = useState<SearchFilters>({
    destination: '',
    startDate: '',
    endDate: '',
    minBudget: '',
    maxBudget: '',
  });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [datePreset, setDatePreset] = useState('all');

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleDatePreset = (preset: string) => {
    setDatePreset(preset);
    const today = new Date();
    let startDate = '';
    let endDate = '';

    switch (preset) {
      case 'this-month':
        startDate = format(startOfMonth(today), 'yyyy-MM-dd');
        endDate = format(endOfMonth(today), 'yyyy-MM-dd');
        break;
      case 'prev-month':
        const prevMonth = subMonths(today, 1);
        startDate = format(startOfMonth(prevMonth), 'yyyy-MM-dd');
        endDate = format(endOfMonth(prevMonth), 'yyyy-MM-dd');
        break;
      case 'next-month':
        const nextMonth = addMonths(today, 1);
        startDate = format(startOfMonth(nextMonth), 'yyyy-MM-dd');
        endDate = format(endOfMonth(nextMonth), 'yyyy-MM-dd');
        break;
      case 'all':
      case 'custom':
      default:
        startDate = '';
        endDate = '';
        break;
    }

    const newFilters = { ...filters, startDate, endDate };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters: SearchFilters = {
      destination: '',
      startDate: '',
      endDate: '',
      minBudget: '',
      maxBudget: '',
    };
    setFilters(emptyFilters);
    setDatePreset('all');
    onFilterChange(emptyFilters);
  };

  const hasActiveFilters = 
    filters.destination || 
    filters.startDate || 
    filters.endDate || 
    filters.minBudget || 
    filters.maxBudget;

  return (
    <div className="space-y-4">
      {/* Main search bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search destinations..."
            value={filters.destination}
            onChange={(e) => handleFilterChange('destination', e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant={showAdvanced ? 'default' : 'outline'}
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <span className="ml-1 px-2 py-0.5 rounded-full bg-coral text-primary-foreground text-xs">
              Active
            </span>
          )}
        </Button>
        {hasActiveFilters && (
          <Button variant="ghost" onClick={clearFilters} className="gap-2">
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {/* Advanced filters */}
      {showAdvanced && (
        <div className="p-4 rounded-xl bg-secondary/50 space-y-4 animate-in slide-in-from-top-2 duration-200">
          {/* Date presets */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Travel Dates</Label>
            <div className="flex flex-wrap gap-2">
              {datePresets.map((preset) => (
                <Button
                  key={preset.value}
                  variant={datePreset === preset.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleDatePreset(preset.value)}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Custom date inputs */}
          {datePreset === 'custom' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">From</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">To</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Budget range */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Budget Range (USD)</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.minBudget}
                  onChange={(e) => handleFilterChange('minBudget', e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.maxBudget}
                  onChange={(e) => handleFilterChange('maxBudget', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
