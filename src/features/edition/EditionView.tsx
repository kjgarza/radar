'use client';

import { useState, useMemo } from 'react';
import { Edition, Blip, Ring, Quadrant } from '@/core/types';
import { RadarChart } from '@/components/radar/RadarChart';
import { FilterSidebar } from '@/components/radar/FilterSidebar';
import { BlipList } from '@/components/radar/BlipList';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

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

  return (
    <div className="flex min-h-screen w-full">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-80 border-r bg-background">
        <FilterSidebar onFilterChange={setFilters} edition={edition} />
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        <div className="container mx-auto p-6 space-y-6">
          {/* Header with View Toggle and Mobile Menu */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Mobile Menu Trigger */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="lg:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 p-0">
                  <FilterSidebar onFilterChange={setFilters} edition={edition} />
                </SheetContent>
              </Sheet>
              
              <h1 className="text-2xl font-bold">
                {edition.version}
              </h1>
            </div>
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
          </div>

          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Visualization Area */}
            <div className="lg:col-span-2">
              {viewMode === 'chart' ? (
                <Card className="p-6">
                  <RadarChart blips={filteredBlips} onBlipClick={handleBlipClick} />
                </Card>
              ) : (
                <BlipList blips={filteredBlips} onBlipClick={handleBlipClick} />
              )}
            </div>

            {/* Blip Detail Panel */}
            <div className="lg:col-span-1">
              {selectedBlip ? (
                <Card className="p-6 sticky top-6">
                  <h3 className="text-xl font-bold mb-4">{selectedBlip.name}</h3>
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
                              className="text-xs bg-muted text-foreground px-2 py-1 rounded border"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {selectedBlip.caseStudyUrl && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          Case Study
                        </p>
                        <a
                          href={selectedBlip.caseStudyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                        >
                          View Case Study
                          <span aria-hidden="true">→</span>
                        </a>
                      </div>
                    )}
                    {selectedBlip.thoughtworksUrl && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          ThoughtWorks Radar
                        </p>
                        <a
                          href={selectedBlip.thoughtworksUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                        >
                          View on ThoughtWorks
                          <span aria-hidden="true">→</span>
                        </a>
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
                              className="text-sm text-primary hover:underline block break-all"
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
        </div>
      </div>
    </div>
  );
}
