import { describe, expect, it } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';
import { fetchApprovedBroadcastTemplates } from './broadcast-templates';

type Row = { id: string; name: string; status: string; created_at: string };

/**
 * Minimal Supabase stub that actually *filters* on `.eq()` (instead of
 * ignoring it), so this test proves the real outcome the spec cares
 * about — PENDING/REJECTED/PAUSED templates never reach the caller —
 * not just that some particular method was called.
 */
function stubDb(rows: Row[]): SupabaseClient {
  const builder = {
    select: () => builder,
    eq: (col: string, val: string) => {
      const filtered = rows.filter((r) => (r as never as Record<string, string>)[col] === val);
      return {
        order: () => Promise.resolve({ data: filtered, error: null }),
      };
    },
  };
  return { from: () => builder } as unknown as SupabaseClient;
}

describe('fetchApprovedBroadcastTemplates @spec:AC-009', () => {
  it('only returns templates with status APPROVED', async () => {
    const db = stubDb([
      { id: '1', name: 'promo_approved', status: 'APPROVED', created_at: '2026-01-01' },
      { id: '2', name: 'promo_pending', status: 'PENDING', created_at: '2026-01-02' },
      { id: '3', name: 'promo_rejected', status: 'REJECTED', created_at: '2026-01-03' },
      { id: '4', name: 'promo_paused', status: 'PAUSED', created_at: '2026-01-04' },
    ]);

    const { data, error } = await fetchApprovedBroadcastTemplates(db);

    expect(error).toBeNull();
    expect(data.map((t) => t.name)).toEqual(['promo_approved']);
  });

  it('returns an empty list (not an error) when no template is approved yet', async () => {
    const db = stubDb([
      { id: '1', name: 'draft_one', status: 'PENDING', created_at: '2026-01-01' },
    ]);

    const { data, error } = await fetchApprovedBroadcastTemplates(db);

    expect(error).toBeNull();
    expect(data).toEqual([]);
  });

  it('surfaces a query error instead of silently returning approved-looking data', async () => {
    const failingDb = {
      from: () => ({
        select: () => ({
          eq: () => ({
            order: () =>
              Promise.resolve({ data: null, error: new Error('connection reset') }),
          }),
        }),
      }),
    } as unknown as SupabaseClient;

    const { data, error } = await fetchApprovedBroadcastTemplates(failingDb);

    expect(data).toEqual([]);
    expect(error).toBeInstanceOf(Error);
  });
});
