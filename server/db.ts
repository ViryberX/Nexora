// Mock Prisma client for development to avoid blocking on local SQLite setup issues

export const prisma = {
  researchSession: {
    create: async () => ({ id: 'mock-session-id' }),
    update: async () => ({})
  },
  researchMessage: {
    create: async () => ({})
  },
  usageRecord: {
    create: async () => ({})
  },
  user: {
    findUnique: async () => ({ id: 'mock', email: 'demo@example.com' })
  },
  $transaction: async (queries: any) => Promise.all(queries)
} as any;
