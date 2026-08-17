import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// ---------------------------------------------------------------------------
// Tests for POST /api/whatsapp/react — the "react to a message with an
// emoji" half of AC-003 (send media / react to messages just like a normal
// WhatsApp app). Media sending itself is covered by send-message.test.ts +
// upload-media.test.ts; this file closes the reaction half, which had no
// coverage at all.
// ---------------------------------------------------------------------------

const MESSAGE_ID = 'msg-row-1'
const CONVERSATION_ID = 'conv-1'

// Per-test scenario knobs.
let targetMessage: Record<string, unknown> | null
let conversation: Record<string, unknown> | null
let config: Record<string, unknown> | null
const reactionUpserts: Array<Record<string, unknown>> = []
const reactionDeletes: Array<Record<string, unknown>> = []

function makeSupabaseMock() {
  function builder(table: string) {
    const b: Record<string, unknown> = {}
    const chain = () => b
    const eqFilters: [string, unknown][] = []
    b.select = vi.fn(chain)
    b.eq = vi.fn((col: string, val: unknown) => {
      eqFilters.push([col, val])
      return b
    })
    b.maybeSingle = vi.fn(() => {
      if (table === 'profiles') return Promise.resolve({ data: { account_id: 'acct-1' }, error: null })
      if (table === 'messages') return Promise.resolve({ data: targetMessage, error: null })
      if (table === 'conversations') return Promise.resolve({ data: conversation, error: null })
      return Promise.resolve({ data: null, error: null })
    })
    b.single = vi.fn(() => {
      if (table === 'whatsapp_config') return Promise.resolve({ data: config, error: null })
      return Promise.resolve({ data: null, error: null })
    })
    b.delete = vi.fn(() => {
      const del: Record<string, unknown> = {}
      del.eq = vi.fn((col: string, val: unknown) => {
        eqFilters.push([col, val])
        return del
      })
      del.then = (resolve: (v: unknown) => unknown) => {
        reactionDeletes.push(Object.fromEntries(eqFilters))
        return resolve({ error: null })
      }
      return del
    })
    b.upsert = vi.fn((payload: Record<string, unknown>) => {
      reactionUpserts.push(payload)
      return Promise.resolve({ error: null })
    })
    return b
  }

  return {
    auth: {
      getUser: vi.fn(async () => ({ data: { user: { id: 'user-1' } }, error: null })),
    },
    from: vi.fn((table: string) => builder(table)),
  }
}

let supabaseMock = makeSupabaseMock()

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => supabaseMock),
}))

vi.mock('@/lib/whatsapp/encryption', () => ({
  decrypt: vi.fn(() => 'plaintext-token'),
}))

const { sendReactionMessage } = vi.hoisted(() => ({
  sendReactionMessage: vi.fn(async () => ({ messageId: 'wamid-reaction-1' })),
}))
vi.mock('@/lib/whatsapp/meta-api', () => ({ sendReactionMessage }))

vi.mock('@/lib/rate-limit', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/rate-limit')>()
  return actual
})

import { __resetRateLimitForTests } from '@/lib/rate-limit'
import { POST } from './route'

function postReaction(body: Record<string, unknown>) {
  return POST(
    new Request('http://localhost/api/whatsapp/react', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
  )
}

describe('POST /api/whatsapp/react @spec:AC-003', () => {
  beforeEach(() => {
    __resetRateLimitForTests()
    reactionUpserts.length = 0
    reactionDeletes.length = 0
    targetMessage = { id: MESSAGE_ID, message_id: 'wamid-original', conversation_id: CONVERSATION_ID }
    conversation = {
      id: CONVERSATION_ID,
      account_id: 'acct-1',
      contact: [{ phone: '+15551234567' }],
    }
    config = { phone_number_id: 'PNID-1', access_token: 'enc-token' }
    supabaseMock = makeSupabaseMock()
    sendReactionMessage.mockClear()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('sends the emoji reaction to Meta and mirrors it into message_reactions', async () => {
    const res = await postReaction({ message_id: MESSAGE_ID, emoji: '👍' })
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.success).toBe(true)

    // Reached Meta with the target message's wamid and the contact's phone.
    expect(sendReactionMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        to: '15551234567',
        targetMessageId: 'wamid-original',
        emoji: '👍',
      }),
    )

    // And the reaction is persisted for the thread to render.
    expect(reactionUpserts).toHaveLength(1)
    expect(reactionUpserts[0]).toMatchObject({
      message_id: MESSAGE_ID,
      actor_type: 'agent',
      emoji: '👍',
    })
  })

  it('removes the reaction (delete, not upsert) when emoji is an empty string', async () => {
    const res = await postReaction({ message_id: MESSAGE_ID, emoji: '' })
    expect(res.status).toBe(200)

    expect(sendReactionMessage).toHaveBeenCalledWith(
      expect.objectContaining({ emoji: '' }),
    )
    expect(reactionUpserts).toHaveLength(0)
    expect(reactionDeletes).toHaveLength(1)
  })

  it('400s when message_id or emoji is missing', async () => {
    const res1 = await postReaction({ emoji: '👍' })
    expect(res1.status).toBe(400)
    expect(sendReactionMessage).not.toHaveBeenCalled()

    const res2 = await postReaction({ message_id: MESSAGE_ID })
    expect(res2.status).toBe(400)
    expect(sendReactionMessage).not.toHaveBeenCalled()
  })

  it('404s when the target message does not exist', async () => {
    targetMessage = null
    const res = await postReaction({ message_id: 'ghost', emoji: '👍' })
    expect(res.status).toBe(404)
    expect(sendReactionMessage).not.toHaveBeenCalled()
  })

  it("400s when the target message was never delivered to WhatsApp (no wamid yet)", async () => {
    targetMessage = { id: MESSAGE_ID, message_id: null, conversation_id: CONVERSATION_ID }
    const res = await postReaction({ message_id: MESSAGE_ID, emoji: '👍' })
    expect(res.status).toBe(400)
    expect(sendReactionMessage).not.toHaveBeenCalled()
  })
})
