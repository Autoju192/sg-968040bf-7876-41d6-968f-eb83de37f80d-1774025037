import { vi } from 'vitest'

export const mockSupabaseChain = {
  select: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
  upsert: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  neq: vi.fn().mockReturnThis(),
  order: vi.fn().mockReturnThis(),
  limit: vi.fn().mockReturnThis(),
  single: vi.fn().mockResolvedValue({ data: null, error: null }),
  maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
  then: undefined as unknown,
}

export const mockAuth = {
  getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-1', email: 'test@example.com' } }, error: null }),
  signInWithPassword: vi.fn().mockResolvedValue({ data: { user: { id: 'user-1' }, session: {} }, error: null }),
  signUp: vi.fn().mockResolvedValue({ data: { user: { id: 'user-1' }, session: {} }, error: null }),
  signOut: vi.fn().mockResolvedValue({ error: null }),
}

export const mockRpc = vi.fn().mockResolvedValue({ data: [], error: null })

export const mockStorage = {
  from: vi.fn().mockReturnValue({
    upload: vi.fn().mockResolvedValue({ data: {}, error: null }),
    getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: 'https://example.com/file.pdf' } }),
  }),
}

export function createMockSupabaseClient() {
  const chain = { ...mockSupabaseChain }
  return {
    auth: mockAuth,
    rpc: mockRpc,
    storage: mockStorage,
    from: vi.fn().mockReturnValue(chain),
  }
}
