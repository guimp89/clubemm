import { describe, expect, it } from 'vitest';
import { resolveDealMove } from './deal-move';

const STAGES = [{ id: 'stage-new' }, { id: 'stage-negotiating' }, { id: 'stage-won' }];

const DEALS = [
  { id: 'deal-1', stage_id: 'stage-new' },
  { id: 'deal-2', stage_id: 'stage-negotiating' },
];

describe('resolveDealMove @spec:AC-008', () => {
  it('moves a deal card dragged into another kanban column', () => {
    expect(resolveDealMove(DEALS, STAGES, 'deal-1', 'stage-negotiating')).toBe(
      'stage-negotiating',
    );
  });

  it('is a no-op when dropped back on its own column', () => {
    expect(resolveDealMove(DEALS, STAGES, 'deal-1', 'stage-new')).toBeNull();
  });

  it('is a no-op for a deal id that does not exist', () => {
    expect(resolveDealMove(DEALS, STAGES, 'ghost-deal', 'stage-won')).toBeNull();
  });

  it('is a no-op when the drop target is not a real stage of this pipeline', () => {
    expect(resolveDealMove(DEALS, STAGES, 'deal-1', 'not-a-stage')).toBeNull();
  });

  it('allows moving straight to the terminal (won) stage', () => {
    expect(resolveDealMove(DEALS, STAGES, 'deal-2', 'stage-won')).toBe('stage-won');
  });
});
