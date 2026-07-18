import { runInvestmentAnalysis } from '../services/investmentAgent.js';
import { saveHistory } from '../services/historyService.js';

/**
 * Controller to handle POST requests for investment analysis
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const analyzeCompany = async (req, res) => {
  try {
    const { company } = req.body;

    if (!company || company.trim() === '') {
      return res.status(400).json({ error: 'Company name is required.' });
    }

    console.log(`Starting analysis for: ${company}`);
    
    // Call our core Orchestrator service
    const analysisResult = await runInvestmentAnalysis(company);
    
    // Save to history
    saveHistory(company, analysisResult);
    
    // Return the successful JSON payload to the frontend
    res.status(200).json(analysisResult);
    
  } catch (error) {
    console.error('Controller Error:', error.message);
    
    // Determine the status code based on the type of error
    // If it's a rate limit or specific API error, we can send a 422 or 503
    let statusCode = 500;
    let errorMessage = error.message || 'An internal server error occurred while analyzing the company.';

    if (error.message.includes('API rate limit')) {
      statusCode = 429;
      errorMessage = error.message;
    } else if (error.message.includes('No financial data found')) {
      statusCode = 404;
      errorMessage = error.message;
    } else if (error.message.includes('valid structured response')) {
      statusCode = 502;
      errorMessage = error.message;
    }

    res.status(statusCode).json({ error: errorMessage });
  }
};
