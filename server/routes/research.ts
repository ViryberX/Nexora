import { Router } from 'express';
import { executeResearch } from '../research.js';
import { prisma } from '../db.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { query, depth } = req.body;
    // const userId = req.user!.userId; // Removed for public access
    
    if (!query) {
      return res.status(400).json({ error: 'Validation Error', message: 'Query is required' });
    }

    const researchDepth = depth === 'deep' ? 'deep' : 'fast';
    
    // Create session
    const session = await prisma.researchSession.create({
      data: {
        type: 'web',
        query,
        status: 'pending'
      }
    });

    try {
      const result = await executeResearch(query, researchDepth);
      
      // Update session and usage
      await prisma.$transaction([
        prisma.researchSession.update({
          where: { id: session.id },
          data: { 
            status: 'completed',
            result: JSON.stringify(result)
          }
        }),
        prisma.usageRecord.create({
          data: {
            action: 'web_research',
            tokensUsed: researchDepth === 'deep' ? 2000 : 500
          }
        })
      ]);

      res.json({ ...result, sessionId: session.id });
    } catch (err: any) {
      await prisma.researchSession.update({
        where: { id: session.id },
        data: { status: 'failed' }
      });
      throw err;
    }
  } catch (error: any) {
    console.error('Research API Error:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

export default router;
