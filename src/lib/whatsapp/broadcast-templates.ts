import type { SupabaseClient } from '@supabase/supabase-js';
import type { MessageTemplate } from '@/types';

/**
 * Templates eligible for a broadcast. Meta only accepts sends built from
 * an APPROVED, synced template — anything else 400s at send time — so the
 * broadcast wizard's Step 1 must only ever offer APPROVED rows for
 * selection (AC-009). Extracted out of the component's `useEffect` so
 * that filter is unit-testable without mounting React.
 */
export async function fetchApprovedBroadcastTemplates(
  supabase: SupabaseClient,
): Promise<{ data: MessageTemplate[]; error: Error | null }> {
  const { data, error } = await supabase
    .from('message_templates')
    .select('*')
    .eq('status', 'APPROVED')
    .order('created_at', { ascending: false });

  if (error) return { data: [], error: error as unknown as Error };
  return { data: (data ?? []) as MessageTemplate[], error: null };
}
