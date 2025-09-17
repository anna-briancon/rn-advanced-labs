import { z } from 'zod';

const currentYear = new Date().getFullYear();

export const robotSchema = z.object({
  name: z.string().min(2, 'Au moins 2 caractères'),
  label: z.string().min(3, 'Au moins 3 caractères'),
  year: z.coerce.number().int('Entier requis')
    .gte(1950, '≥ 1950')
    .lte(currentYear, `≤ ${currentYear}`),
  type: z.enum(['industrial', 'service', 'medical', 'educational', 'other'], {
    required_error: 'Type requis',
  }),
});

export type RobotInput = z.infer<typeof robotSchema>;
