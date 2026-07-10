import express from 'express';
import { analyzeCompany } from '../controllers/analysisController.js';
import { getHistory, deleteHistory } from '../services/historyService.js';

const router = express.Router();

// POST /api/analyze
// Accepts JSON: { "company": "Apple" }
router.post('/analyze', analyzeCompany);

// GET /api/history
// Returns the saved analysis history
router.get('/history', (req, res) => {
  try {
    const history = getHistory();
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// DELETE /api/history/:id
// Removes a specific history entry
router.delete('/history/:id', (req, res) => {
  try {
    const { id } = req.params;
    const success = deleteHistory(id);
    
    if (success) {
      res.status(200).json({ message: 'History entry deleted successfully' });
    } else {
      res.status(404).json({ error: 'History entry not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete history entry' });
  }
});

export default router;
