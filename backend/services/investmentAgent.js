import { getGroqModel } from './groqService.js';
import { investmentPrompt } from '../prompts/promptTemplate.js';
import { getCompanyFinancials, getHistoricalData } from './financeService.js';
import { getCompanyNews } from './newsService.js';

/**
 * Orchestrates the full AI Investment Research process
 * @param {string} companyName - User input for the company
 * @returns {Object} The complete JSON response ready for the frontend
 */
export const runInvestmentAnalysis = async (companyName) => {
  try {
    // 1. Fetch data in parallel for better performance
    const [financials, news, chartData] = await Promise.all([
      getCompanyFinancials(companyName),
      getCompanyNews(companyName),
      getHistoricalData(companyName)
    ]);

    // 2. Format News for the Prompt
    let newsContext = 'No recent news available.';
    let overallSentiment = 'Neutral';

    if (news && news.length > 0) {
      newsContext = news.map(n => 
        `- Headline: ${n.headline}\n  Sentiment: ${n.sentiment} (Score: ${n.sentimentScore})`
      ).join('\n');
      
      // Calculate average sentiment for the final output
      const avgScore = news.reduce((acc, curr) => acc + curr.sentimentScore, 0) / news.length;
      if (avgScore > 1) overallSentiment = 'Bullish';
      else if (avgScore > 0) overallSentiment = 'Positive';
      else if (avgScore < -1) overallSentiment = 'Bearish';
      else if (avgScore < 0) overallSentiment = 'Negative';
    }

    // 3. Initialize Model and Format Prompt
    const model = getGroqModel();
    const formattedPrompt = await investmentPrompt.format({
      company: financials.company,
      industry: financials.industry,
      sector: financials.sector,
      marketCap: financials.marketCap,
      revenue: financials.revenue,
      peRatio: financials.peRatio,
      eps: financials.eps,
      profitMargin: financials.profitMargin,
      dividendYield: financials.dividendYield,
      fiftyTwoWeekHigh: financials.fiftyTwoWeekHigh,
      fiftyTwoWeekLow: financials.fiftyTwoWeekLow,
      newsContext: newsContext
    });

    // 4. Call Groq LLM
    const response = await model.invoke(formattedPrompt);
    let content = response.content;

    // 5. Clean up the JSON response (Handle potential markdown from LLM)
    // Sometimes LLMs wrap JSON in ```json ... ``` despite instructions not to.
    content = content.replace(/```json/g, '').replace(/```/g, '').trim();

    const aiDecision = JSON.parse(content);

    // 6. Construct the final output object requested by the frontend
    return {
      company: financials.company,
      overview: financials.overview,
      industry: financials.industry,
      sector: financials.sector,
      marketCap: financials.marketCap,
      revenue: financials.revenue,
      peRatio: financials.peRatio,
      eps: financials.eps,
      profitMargin: financials.profitMargin,
      dividendYield: financials.dividendYield,
      fiftyTwoWeekHigh: financials.fiftyTwoWeekHigh,
      fiftyTwoWeekLow: financials.fiftyTwoWeekLow,
      news: news,
      newsSentiment: overallSentiment,
      chartData: chartData,
      investmentScore: aiDecision.investmentScore,
      confidenceScore: aiDecision.confidenceScore,
      riskLevel: aiDecision.riskLevel,
      recommendation: aiDecision.recommendation,
      pros: aiDecision.pros,
      cons: aiDecision.cons,
      summary: aiDecision.summary
    };

  } catch (error) {
    console.error(`Analysis Agent Error for ${companyName}:`, error);
    
    // Check if the error is JSON parsing related
    if (error instanceof SyntaxError) {
       throw new Error('AI failed to return a valid structured response. Please try again.');
    }
    
    // Bubble up the error (e.g. Rate limits, invalid symbol)
    throw error;
  }
};
