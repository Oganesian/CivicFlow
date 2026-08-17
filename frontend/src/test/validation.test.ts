import { describe, it, expect } from 'vitest';
import * as z from 'zod';

const issueSchema = z.object({
  categoryId: z.string().min(1, 'Please select an issue category'),
  title: z.string().min(5, 'Title must be at least 5 characters').max(200),
  description: z.string().min(15, 'Please provide a detailed description (at least 15 characters)'),
  district: z.string().min(1, 'Please select a municipal district'),
  locationName: z.string().min(3, 'Location description is required'),
  reporterEmail: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
});

describe('Report Issue Form Validation', () => {
  it('validates a correct form submission', () => {
    const validData = {
      categoryId: '33333333-3333-3333-3333-333333333301',
      title: 'Pothole on main street',
      description: 'Deep road hazard causing near bicycle accidents.',
      district: 'Mitte',
      locationName: 'Schillerstraße 12',
      reporterEmail: 'citizen@example.test',
    };

    const result = issueSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('rejects short title and descriptions', () => {
    const invalidData = {
      categoryId: '33333333-3333-3333-3333-333333333301',
      title: 'Bad',
      description: 'Short',
      district: 'Mitte',
      locationName: 'Schillerstraße 12',
      reporterEmail: '',
    };

    const result = issueSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      const errorMap = result.error.flatten().fieldErrors;
      expect(errorMap.title).toBeDefined();
      expect(errorMap.description).toBeDefined();
    }
  });

  it('allows optional empty email without error', () => {
    const validWithoutEmail = {
      categoryId: '33333333-3333-3333-3333-333333333301',
      title: 'Broken lamp post light',
      description: 'The street lamp is completely dark at night.',
      district: 'Nordstadt',
      locationName: 'Goethebrücke 4',
      reporterEmail: '',
    };

    const result = issueSchema.safeParse(validWithoutEmail);
    expect(result.success).toBe(true);
  });
});
