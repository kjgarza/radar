import { z } from 'zod';

export const MovementSchema = z.enum(['moved_in', 'moved_out', 'no_change']);
export const RingSchema = z.enum(['Adopt', 'Trial', 'Assess', 'Hold']);
export const QuadrantSchema = z.enum([
  'Languages & Frameworks',
  'Tools',
  'Platforms',
  'Techniques',
]);

export const BlipSchema = z.object({
  id: z.string(),
  name: z.string(),
  quadrant: QuadrantSchema,
  ring: RingSchema,
  description: z.string(),
  isNew: z.boolean(),
  movement: MovementSchema,
  previousRing: RingSchema.optional(),
  links: z.array(z.string().url()).default([]),
  tags: z.array(z.string()).default([]),
});

export const EditionSchema = z.object({
  id: z.string(),
  version: z.string(),
  releaseDate: z.string().datetime(),
  description: z.string(),
  blips: z.array(BlipSchema),
});

export const RadarDataSchema = z.object({
  editions: z.array(EditionSchema),
});

export type Movement = z.infer<typeof MovementSchema>;
export type Ring = z.infer<typeof RingSchema>;
export type Quadrant = z.infer<typeof QuadrantSchema>;
export type Blip = z.infer<typeof BlipSchema>;
export type Edition = z.infer<typeof EditionSchema>;
export type RadarData = z.infer<typeof RadarDataSchema>;
