'use client';

import { useState, useMemo } from 'react';
import { Edition, Blip, Ring, Quadrant } from '@/core/types';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface FilterSidebarProps {
  onFilterChange: (filters: {
    rings: Ring[];
    quadrants: Quadrant[];
    search: string;
  }) => void;
  edition: Edition;
}

const RINGS: Ring[] = ['Adopt', 'Trial', 'Assess', 'Hold'];
const QUADRANTS: Quadrant[] = [
  'Languages & Frameworks',
  'Tools',
  'Platforms',
  'Techniques',
];

export function FilterSidebar({ onFilterChange, edition }: FilterSidebarProps) {
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

  // Calculate stats
  const stats = useMemo(() => {
    const total = edition.blips.length;
    const newCount = edition.blips.filter((b) => b.isNew).length;
    const byRing = RINGS.reduce((acc, ring) => {
      acc[ring] = edition.blips.filter((b) => b.ring === ring).length;
      return acc;
    }, {} as Record<Ring, number>);

    return { total, newCount, byRing };
  }, [edition]);

  return (
    <div className="space-y-6 p-6">
      {/* Edition Info */}
      <div>
        <h2 className="text-xl font-bold mb-2">{edition.version}</h2>
        <p className="text-sm text-muted-foreground">
          {new Date(edition.releaseDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      <Separator />

      {/* Stats */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold">Overview</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Blips</span>
            <span className="text-sm font-medium">{stats.total}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">New</span>
            <span className="text-sm font-medium">{stats.newCount}</span>
          </div>
          {RINGS.map((ring) => (
            <div key={ring} className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{ring}</span>
              <span className="text-sm font-medium">{stats.byRing[ring]}</span>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Search */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold">Search</h3>
        <Input
          type="text"
          placeholder="Search blips..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full"
        />
      </div>

      <Separator />

      {/* Rings Filter */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold">Rings</h3>
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

      <Separator />

      {/* Quadrants Filter */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold">Quadrants</h3>
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
        <>
          <Separator />
          <button
            onClick={handleReset}
            className="w-full text-sm text-muted-foreground hover:text-primary"
          >
            Clear all filters
          </button>
        </>
      )}
    </div>
  );
}
