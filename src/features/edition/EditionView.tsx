'use client';

import { useState, useMemo } from 'react';
import { Edition, Blip, Ring, Quadrant } from '@/core/types';
import { RadarChart } from '@/components/radar/RadarChart';
import { FilterControls } from '@/components/radar/FilterControls';
import { BlipList } from '@/components/radar/BlipList';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface EditionViewProps {
  edition: Edition;
}

export function EditionView({ edition }: EditionViewProps) {
  const [filters, setFilters] = useState<{
    rings: Ring[];
    quadrants: Quadrant[];
    search: string;
  }>({
    rings: [],
    quadrants: [],
    search: '',
  });
  const [selectedBlip, setSelectedBlip] = useState<Blip | null>(null);
  const [viewMode, setViewMode] = useState<'chart' | 'list'>('chart');

  const filteredBlips = useMemo(() => {
    return edition.blips.filter((blip) => {
      // Filter by rings
      if (filters.rings.length > 0 && !filters.rings.includes(blip.ring)) {
        return false;
      }

      // Filter by quadrants
      if (
        filters.quadrants.length > 0 &&
        !filters.quadrants.includes(blip.quadrant)
      ) {
        return false;
      }

      // Filter by search
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesName = blip.name.toLowerCase().includes(searchLower);
        const matchesDescription = blip.description
          .toLowerCase()
          .includes(searchLower);
        const matchesTags = blip.tags.some((tag) =>
          tag.toLowerCase().includes(searchLower)
        );

        if (!matchesName && !matchesDescription && !matchesTags) {
          return false;
        }
      }

      return true;
    });
  }, [edition.blips, filters]);

  const handleBlipClick = (blip: Blip) => {
    setSelectedBlip(blip);
  };

  const releaseDate = new Date(edition.releaseDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="space-y-6">
      {/* Edition Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">{edition.version}</h1>
        <p className="text-muted-foreground">{releaseDate}</p>
        <p className="text-lg">{edition.description}</p>
      </div>

      {/* View Mode Toggle */}
      <div className="flex gap-2">
        <Button
          variant={viewMode === 'chart' ? 'default' : 'outline'}
          onClick={() => setViewMode('chart')}
        >
          Chart View
        </Button>
        <Button
          variant={viewMode === 'list' ? 'default' : 'outline'}
          onClick={() => setViewMode('list')}
        >
          List View
        </Button>
      </div>

      {/* Filters */}
      <FilterControls onFilterChange={setFilters} />

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {viewMode === 'chart' ? (
            <Card className="p-6">
              <RadarChart blips={filteredBlips} onBlipClick={handleBlipClick} />
            </Card>
          ) : (
            <BlipList blips={filteredBlips} onBlipClick={handleBlipClick} />
          )}
        </div>

        {/* Selected Blip Detail */}
        <div className="lg:col-span-1">
          {selectedBlip ? (
            <Card className="p-6 sticky top-4">
              <h3 className="text-xl font-bold mb-2">{selectedBlip.name}</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Ring
                  </p>
                  <p className="text-sm">{selectedBlip.ring}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Quadrant
                  </p>
                  <p className="text-sm">{selectedBlip.quadrant}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Description
                  </p>
                  <p className="text-sm">{selectedBlip.description}</p>
                </div>
                {selectedBlip.movement !== 'no_change' && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Movement
                    </p>
                    <p className="text-sm capitalize">
                      {selectedBlip.movement.replace('_', ' ')}
                      {selectedBlip.previousRing &&
                        ` from ${selectedBlip.previousRing}`}
                    </p>
                  </div>
                )}
                {selectedBlip.tags.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Tags
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {selectedBlip.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-secondary px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {selectedBlip.links.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Links
                    </p>
                    <div className="space-y-1">
                      {selectedBlip.links.map((link, index) => (
                        <a
                          key={index}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline block"
                        >
                          {link}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ) : (
            <Card className="p-6 text-center text-muted-foreground">
              <p>Click on a blip to see details</p>
            </Card>
          )}
        </div>
      </div>

      {/* Stats */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-2xl font-bold">{filteredBlips.length}</p>
            <p className="text-sm text-muted-foreground">Total Blips</p>
          </div>
          <div>
            <p className="text-2xl font-bold">
              {filteredBlips.filter((b) => b.isNew).length}
            </p>
            <p className="text-sm text-muted-foreground">New</p>
          </div>
          <div>
            <p className="text-2xl font-bold">
              {filteredBlips.filter((b) => b.ring === 'Adopt').length}
            </p>
            <p className="text-sm text-muted-foreground">Adopt</p>
          </div>
          <div>
            <p className="text-2xl font-bold">
              {filteredBlips.filter((b) => b.ring === 'Trial').length}
            </p>
            <p className="text-sm text-muted-foreground">Trial</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
