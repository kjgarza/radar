'use client';

import { useState, useMemo, useEffect } from 'react';
import { Edition, Blip, Ring, Quadrant } from '@/core/types';
import { RadarChart } from '@/components/radar/RadarChart';
import { FilterSidebar } from '@/components/radar/FilterSidebar';
import { BlipList } from '@/components/radar/BlipList';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Menu, X } from 'lucide-react';
import { useMediaQuery } from '@/hooks/use-media-query';

interface EditionViewProps {
  edition: Edition;
}

const QUADRANTS: Quadrant[] = [
  'Languages & Frameworks',
  'Tools',
  'Platforms',
  'Techniques',
];

export function EditionView({ edition }: EditionViewProps) {
  const isMobile = useMediaQuery('(max-width: 1024px)');
  
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
  const [isBlipSheetOpen, setIsBlipSheetOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'chart' | 'list'>('chart');

  // Initialize mobile with first quadrant selected
  useEffect(() => {
    if (isMobile && filters.quadrants.length === 0) {
      setFilters((prev) => ({
        ...prev,
        quadrants: [QUADRANTS[0]], // 'Languages & Frameworks'
      }));
    }
  }, [isMobile, filters.quadrants.length]);

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
    if (isMobile) {
      setIsBlipSheetOpen(true);
    }
  };

  const handleQuadrantClick = (quadrant: Quadrant) => {
    if (isMobile) {
      setFilters((prev) => ({
        ...prev,
        quadrants: [quadrant],
      }));
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-80 border-r bg-background">
        <FilterSidebar onFilterChange={setFilters} edition={edition} isMobile={false} currentFilters={filters} />
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
                  <FilterSidebar onFilterChange={setFilters} edition={edition} isMobile={isMobile} currentFilters={filters} />
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
                  <RadarChart 
                    blips={isMobile && filters.quadrants.length === 1 ? filteredBlips : edition.blips} 
                    onBlipClick={handleBlipClick}
                    zoomQuadrant={isMobile && filters.quadrants.length === 1 ? filters.quadrants[0] : undefined}
                    onQuadrantClick={isMobile ? handleQuadrantClick : undefined}
                  />
                </Card>
              ) : (
                <BlipList blips={filteredBlips} onBlipClick={handleBlipClick} />
              )}
            </div>

            {/* Blip Detail Panel - Desktop only */}
            <div className="hidden lg:block lg:col-span-1">
              {selectedBlip ? (
                <Card className="p-6 sticky top-6">
                  <h3 className="text-xl font-bold mb-4">{selectedBlip.name}</h3>
                  <BlipDetailContent blip={selectedBlip} />
                </Card>
              ) : (
                <Card className="p-6 text-center text-muted-foreground">
                  <p>Click on a blip to see details</p>
                </Card>
              )}
            </div>

            {/* Mobile Blip Detail - shown as card below chart */}
            <div className="lg:hidden">
              {selectedBlip ? (
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">{selectedBlip.name}</h3>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => setSelectedBlip(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <BlipDetailContent blip={selectedBlip} />
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

// Extracted blip detail content component
function BlipDetailContent({ blip }: { blip: Blip }) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-1">Ring</p>
        <p className="text-sm">{blip.ring}</p>
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-1">Quadrant</p>
        <p className="text-sm">{blip.quadrant}</p>
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-1">Description</p>
        <p className="text-sm">{blip.description}</p>
      </div>
      {blip.movement !== 'no_change' && (
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">Movement</p>
          <p className="text-sm capitalize">
            {blip.movement.replace('_', ' ')}
            {blip.previousRing && ` from ${blip.previousRing}`}
          </p>
        </div>
      )}
      {blip.tags.length > 0 && (
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">Tags</p>
          <div className="flex flex-wrap gap-1">
            {blip.tags.map((tag) => (
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
      {blip.caseStudyUrl && (
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">Case Study</p>
          <a
            href={blip.caseStudyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline inline-flex items-center gap-1"
          >
            View Case Study
            <span aria-hidden="true">→</span>
          </a>
        </div>
      )}
      {blip.thoughtworksUrl && (
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">ThoughtWorks Radar</p>
          <a
            href={blip.thoughtworksUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline inline-flex items-center gap-1"
          >
            View on ThoughtWorks
            <span aria-hidden="true">→</span>
          </a>
        </div>
      )}
      {blip.links.length > 0 && (
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">Links</p>
          <div className="space-y-1">
            {blip.links.map((link, index) => (
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
  );
}
