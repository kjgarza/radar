import type {
  Movement,
  Ring,
  Quadrant,
  Blip,
  Edition,
  RadarData,
} from '../schemas/radar.schema';

export type {
  Movement,
  Ring,
  Quadrant,
  Blip,
  Edition,
  RadarData,
};

export interface BlipHistory {
  blipId: string;
  name: string;
  entries: Array<{
    editionId: string;
    version: string;
    releaseDate: string;
    ring: string;
    movement: string;
  }>;
}

export interface RadarChartData {
  quadrant: string;
  ring: string;
  blips: Blip[];
}
