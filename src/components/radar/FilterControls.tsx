'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Ring, Quadrant } from '@/core/types';

interface FilterControlsProps {
  onFilterChange: (filters: {
    rings: Ring[];
    quadrants: Quadrant[];
    search: string;
  }) => void;
}

const RINGS: Ring[] = ['Adopt', 'Trial', 'Assess', 'Hold'];
const QUADRANTS: Quadrant[] = [
  'Languages & Frameworks',
  'Tools',
  'Platforms',
  'Techniques',
];

export function FilterControls({ onFilterChange }: FilterControlsProps) {
  const [selectedRings, setSelectedRings] = useState<Ring[]>([]);
  const [selectedQuadrants, setSelectedQuadrants] = useState<Quadrant[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleRingToggle = (ring: Ring) => {
    const newRings = selectedRings.includes(ring)
      ? selectedRings.filter((r) => r !== ring)
      : [...selectedRings, ring];
    setSelectedRings(newRings);
    onFilterChange({
      rings: newRings,
      quadrants: selectedQuadrants,
      search: searchQuery,
    });
  };

  const handleQuadrantToggle = (quadrant: Quadrant) => {
    const newQuadrants = selectedQuadrants.includes(quadrant)
      ? selectedQuadrants.filter((q) => q !== quadrant)
      : [...selectedQuadrants, quadrant];
    setSelectedQuadrants(newQuadrants);
    onFilterChange({
      rings: selectedRings,
      quadrants: newQuadrants,
      search: searchQuery,
    });
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onFilterChange({
      rings: selectedRings,
      quadrants: selectedQuadrants,
      search: value,
    });
  };

  const handleReset = () => {
    setSelectedRings([]);
    setSelectedQuadrants([]);
    setSearchQuery('');
    onFilterChange({ rings: [], quadrants: [], search: '' });
  };

  return (
    <Card className="p-4 space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Search</label>
        <Input
          type="text"
          placeholder="Search blips by name, description, or tags..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full"
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Rings</label>
        <div className="flex flex-wrap gap-2">
          {RINGS.map((ring) => (
            <Badge
              key={ring}
              variant={selectedRings.includes(ring) ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => handleRingToggle(ring)}
            >
              {ring}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Quadrants</label>
        <div className="flex flex-wrap gap-2">
          {QUADRANTS.map((quadrant) => (
            <Badge
              key={quadrant}
              variant={selectedQuadrants.includes(quadrant) ? 'default' : 'outline'}
              className="cursor-pointer text-xs"
              onClick={() => handleQuadrantToggle(quadrant)}
            >
              {quadrant}
            </Badge>
          ))}
        </div>
      </div>

      {(selectedRings.length > 0 ||
        selectedQuadrants.length > 0 ||
        searchQuery) && (
        <Button onClick={handleReset} variant="outline" className="w-full">
          Reset Filters
        </Button>
      )}
    </Card>
  );
}
