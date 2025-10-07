import { RadarService } from '@/core/services/radar.service';
import { EditionView } from '@/features/edition/EditionView';
import { notFound } from 'next/navigation';

type Params = Promise<{ id: string }>;

interface EditionPageProps {
  params: Params;
}

export default async function EditionPage(props: EditionPageProps) {
  const params = await props.params;
  const radarService = RadarService.getInstance();
  const edition = radarService.getEditionById(params.id);

  if (!edition) {
    notFound();
  }

  return <EditionView edition={edition} />;
}

export function generateStaticParams() {
  const radarService = RadarService.getInstance();
  const editions = radarService.getAllEditions();

  return editions.map((edition) => ({
    id: edition.id,
  }));
}
