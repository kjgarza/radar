import { RadarService } from '@/core/services/radar.service';
import { EditionView } from '@/features/edition/EditionView';

export default function Home() {
  const radarService = RadarService.getInstance();
  const latestEdition = radarService.getLatestEdition();

  if (!latestEdition) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold mb-4">No Radar Data Available</h1>
        <p className="text-muted-foreground">
          Please add radar data to get started.
        </p>
      </div>
    );
  }

  return <EditionView edition={latestEdition} />;
}
