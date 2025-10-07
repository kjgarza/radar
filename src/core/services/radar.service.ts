import { RadarData, RadarDataSchema, Edition, Blip } from '../schemas/radar.schema';
import { BlipHistory } from '../types';
import radarDataJson from '../../../data/radar.json';

export class RadarService {
  private static instance: RadarService;
  private radarData: RadarData;

  private constructor() {
    // Validate the JSON data at build time
    this.radarData = RadarDataSchema.parse(radarDataJson);
  }

  static getInstance(): RadarService {
    if (!RadarService.instance) {
      RadarService.instance = new RadarService();
    }
    return RadarService.instance;
  }

  getAllEditions(): Edition[] {
    return this.radarData.editions;
  }

  getLatestEdition(): Edition | null {
    const editions = this.radarData.editions;
    if (editions.length === 0) return null;
    
    // Sort by release date descending
    const sorted = [...editions].sort(
      (a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
    );
    return sorted[0];
  }

  getEditionById(id: string): Edition | null {
    return this.radarData.editions.find((edition) => edition.id === id) || null;
  }

  getBlipHistory(blipId: string): BlipHistory | null {
    const entries: BlipHistory['entries'] = [];
    let blipName = '';

    for (const edition of this.radarData.editions) {
      const blip = edition.blips.find((b) => b.id === blipId);
      if (blip) {
        blipName = blip.name;
        entries.push({
          editionId: edition.id,
          version: edition.version,
          releaseDate: edition.releaseDate,
          ring: blip.ring,
          movement: blip.movement,
        });
      }
    }

    if (entries.length === 0) return null;

    // Sort by release date ascending
    entries.sort(
      (a, b) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime()
    );

    return {
      blipId,
      name: blipName,
      entries,
    };
  }

  getAllBlips(): Blip[] {
    const latestEdition = this.getLatestEdition();
    return latestEdition ? latestEdition.blips : [];
  }

  getBlipById(blipId: string): Blip | null {
    const latestEdition = this.getLatestEdition();
    if (!latestEdition) return null;
    return latestEdition.blips.find((b) => b.id === blipId) || null;
  }

  searchBlips(query: string, editionId?: string): Blip[] {
    const edition = editionId
      ? this.getEditionById(editionId)
      : this.getLatestEdition();

    if (!edition) return [];

    const lowerQuery = query.toLowerCase();
    return edition.blips.filter(
      (blip) =>
        blip.name.toLowerCase().includes(lowerQuery) ||
        blip.description.toLowerCase().includes(lowerQuery) ||
        blip.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  }

  filterBlips(
    filters: {
      rings?: string[];
      quadrants?: string[];
      tags?: string[];
    },
    editionId?: string
  ): Blip[] {
    const edition = editionId
      ? this.getEditionById(editionId)
      : this.getLatestEdition();

    if (!edition) return [];

    return edition.blips.filter((blip) => {
      if (filters.rings && filters.rings.length > 0) {
        if (!filters.rings.includes(blip.ring)) return false;
      }
      if (filters.quadrants && filters.quadrants.length > 0) {
        if (!filters.quadrants.includes(blip.quadrant)) return false;
      }
      if (filters.tags && filters.tags.length > 0) {
        if (!filters.tags.some((tag) => blip.tags.includes(tag))) return false;
      }
      return true;
    });
  }
}
