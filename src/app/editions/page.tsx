import { RadarService } from '@/core/services/radar.service';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export default function EditionsPage() {
  const radarService = RadarService.getInstance();
  const editions = radarService.getAllEditions();

  // Sort editions by release date descending
  const sortedEditions = [...editions].sort(
    (a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">Radar Editions</h1>
        <p className="text-muted-foreground">
          Browse through all published technology radar editions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedEditions.map((edition) => {
          const releaseDate = new Date(edition.releaseDate).toLocaleDateString(
            'en-US',
            {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }
          );

          return (
            <Link key={edition.id} href={`/edition/${edition.id}`}>
              <Card className="p-6 hover:shadow-lg transition-shadow h-full cursor-pointer">
                <h2 className="text-xl font-bold mb-2">{edition.version}</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  {releaseDate}
                </p>
                <p className="text-sm mb-4">{edition.description}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{edition.blips.length} blips</span>
                  <span>
                    {edition.blips.filter((b) => b.isNew).length} new
                  </span>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {editions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No editions available yet.</p>
        </div>
      )}
    </div>
  );
}
