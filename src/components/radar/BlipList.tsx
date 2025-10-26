'use client';

import { Blip } from '@/core/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface BlipListProps {
  blips: Blip[];
  onBlipClick?: (blip: Blip) => void;
}

export function BlipList({ blips, onBlipClick }: BlipListProps) {
  const sortedBlips = [...blips].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold mb-4">
        Blips ({blips.length})
      </h3>
      {sortedBlips.map((blip) => (
        <Card
          key={blip.id}
          className="p-4 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onBlipClick?.(blip)}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-semibold text-base">{blip.name}</h4>
                {blip.isNew && (
                  <Badge variant="default" className="text-xs">
                    New
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {blip.description}
              </p>
              <div className="flex flex-wrap gap-2 items-center">
                <Badge variant="outline" className="text-xs">
                  {blip.ring}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {blip.quadrant}
                </Badge>
                {blip.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="text-xs"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              {blip.links.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-3">
                  {blip.links.map((link, index) => (
                    <a
                      key={index}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Link {index + 1}
                    </a>
                  ))}
                </div>
              )}
              {(blip.caseStudyUrl || blip.thoughtworksUrl) && (
                <div className="mt-2 flex flex-wrap gap-3">
                  {blip.caseStudyUrl && (
                    <a
                      href={blip.caseStudyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Case Study
                      <span aria-hidden="true">→</span>
                    </a>
                  )}
                  {blip.thoughtworksUrl && (
                    <a
                      href={blip.thoughtworksUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      ThoughtWorks
                      <span aria-hidden="true">→</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
      {blips.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No blips found matching your filters.
        </div>
      )}
    </div>
  );
}
