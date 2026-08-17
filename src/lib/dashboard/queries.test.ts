import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import { loadConversationsSeries, loadPipelineDonut } from "./queries";

// Minimal SupabaseClient stub: each `.from(table)` returns a thenable
// query builder that resolves to a fixed { data, error } for that
// table, ignoring the specific filter chain (the queries under test
// don't branch on filter values — they just need the terminal rows).
function stubDb(rows: Record<string, unknown[]>): SupabaseClient {
  function builder(table: string) {
    const b: Record<string, unknown> = {
      select: () => b,
      eq: () => b,
      gte: () => b,
      lt: () => b,
      order: () => b,
      limit: () => b,
      then: (onF: (v: unknown) => unknown) =>
        Promise.resolve({ data: rows[table] ?? [], error: null }).then(onF),
    };
    return b;
  }
  return { from: (t: string) => builder(t) } as unknown as SupabaseClient;
}

describe("loadConversationsSeries @spec:AC-027", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-18T12:00:00"));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("buckets incoming (customer) vs outgoing (agent/bot) messages per local day for the selected period", async () => {
    const db = stubDb({
      messages: [
        { created_at: "2026-05-17T10:00:00", sender_type: "customer" },
        { created_at: "2026-05-17T10:05:00", sender_type: "agent" },
        { created_at: "2026-05-18T09:00:00", sender_type: "customer" },
        { created_at: "2026-05-18T09:01:00", sender_type: "bot" },
        { created_at: "2026-05-18T09:02:00", sender_type: "bot" },
      ],
    });

    const series = await loadConversationsSeries(db, 3);

    expect(series.map((p) => p.day)).toEqual([
      "2026-05-16",
      "2026-05-17",
      "2026-05-18",
    ]);
    expect(series.find((p) => p.day === "2026-05-16")).toEqual({
      day: "2026-05-16",
      incoming: 0,
      outgoing: 0,
    });
    expect(series.find((p) => p.day === "2026-05-17")).toEqual({
      day: "2026-05-17",
      incoming: 1,
      outgoing: 1,
    });
    // bot counts as outgoing alongside agent.
    expect(series.find((p) => p.day === "2026-05-18")).toEqual({
      day: "2026-05-18",
      incoming: 1,
      outgoing: 2,
    });
  });

  it("still emits a zero-point for days with no activity, so the chart has a continuous range", async () => {
    const db = stubDb({ messages: [] });
    const series = await loadConversationsSeries(db, 2);
    expect(series).toEqual([
      { day: "2026-05-17", incoming: 0, outgoing: 0 },
      { day: "2026-05-18", incoming: 0, outgoing: 0 },
    ]);
  });
});

describe("loadPipelineDonut @spec:AC-027", () => {
  it("summarizes open-deal count and value per pipeline stage for the period snapshot", async () => {
    const db = stubDb({
      pipeline_stages: [
        { id: "s1", name: "Novo", color: "#111111" },
        { id: "s2", name: "Negociando", color: "#222222" },
        { id: "s3", name: "Vazio", color: "#333333" },
      ],
      deals: [
        { stage_id: "s1", value: 100 },
        { stage_id: "s1", value: 50 },
        { stage_id: "s2", value: 200 },
      ],
    });

    const donut = await loadPipelineDonut(db);

    expect(donut.totalValue).toBe(350);
    expect(donut.stages).toEqual([
      { id: "s1", name: "Novo", color: "#111111", dealCount: 2, totalValue: 150 },
      { id: "s2", name: "Negociando", color: "#222222", dealCount: 1, totalValue: 200 },
    ]);
    // The empty stage is hidden from the ring — 0 deals, 0 value.
    expect(donut.stages.find((s) => s.id === "s3")).toBeUndefined();
  });
});
