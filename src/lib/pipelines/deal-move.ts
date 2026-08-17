import type { Deal, PipelineStage } from '@/types';

/**
 * Pure decision logic behind `PipelineBoard`'s `onDragEnd`: given the
 * current deals/stages and a drop target, decides whether the deal should
 * actually move — and to which stage.
 *
 * Extracted out of the dnd-kit drag handler so the kanban "move a deal
 * between pipeline stages" behavior (AC-008) is unit-testable without
 * mounting drag-and-drop machinery.
 *
 * Returns the target stage id when the move is valid, or `null` when the
 * drop should be a no-op (unknown deal, dropped on its own stage, or
 * dropped on something that isn't a real stage of this pipeline).
 */
export function resolveDealMove(
  deals: Pick<Deal, 'id' | 'stage_id'>[],
  stages: Pick<PipelineStage, 'id'>[],
  dealId: string,
  targetStageId: string,
): string | null {
  const deal = deals.find((d) => d.id === dealId);
  if (!deal) return null;
  if (deal.stage_id === targetStageId) return null;
  if (!stages.some((s) => s.id === targetStageId)) return null;
  return targetStageId;
}
