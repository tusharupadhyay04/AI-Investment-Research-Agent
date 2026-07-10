import axios from 'axios';
import dotenv from 'dotenv';
import Sentiment from 'sentiment';

dotenv.config();

const NEWS_API_URL = 'https://newsapi.org/v2/everything';
const sentiment = new Sentiment();

/**
 * Fetches latest news for a company and performs sentiment analysis
 * @param {string} companyName - The name of the company (e.g., Apple)
 * @returns {Array} Array of 5 structured news objects with sentiment
 */
export const getCompanyNews = async (companyName) => {
  try {
    if (!companyName) {
      throw new Error('Company name is required for news search');
    }

    const apiKey = process.env.NEWS_API_KEY;
    
    // Fetch recent news about the company
    const response = await axios.get(NEWS_API_URL, {
      params: {
        q: `"${companyName}"`, // Exact match for company name
        language: 'en',
        sortBy: 'relevancy', // Most relevant first
        pageSize: 5, // We only need the top 5 as requested
        apiKey: apiKey
      }
    });

    const articles = response.data.articles;

    if (!articles || articles.length === 0) {
      return []; // Return empty array if no news found
    }

    // Map through articles, extract required fields, and calculate sentiment
    const processedNews = articles.map(article => {
      // Analyze the headline and description together for a better sentiment score
      const textToAnalyze = `${article.title || ''} ${article.description || ''}`;
      const sentimentResult = sentiment.analyze(textToAnalyze);
      
      // Determine human-readable sentiment label based on AFINN score
      let sentimentLabel = 'Neutral';
      if (sentimentResult.score > 2) sentimentLabel = 'Bullish';
      else if (sentimentResult.score > 0) sentimentLabel = 'Positive';
      else if (sentimentResult.score < -2) sentimentLabel = 'Bearish';
      else if (sentimentResult.score < 0) sentimentLabel = 'Negative';

      return {
        headline: article.title || 'No Title',
        description: article.description || 'No Description',
        date: article.publishedAt,
        source: article.source.name || 'Unknown Source',
        sentiment: sentimentLabel,
        sentimentScore: sentimentResult.score // Kept for AI context
      };
    });

    return processedNews;
  } catch (error) {
    console.error(`Error fetching news for ${companyName}:`, error.message);
    // Return empty array instead of throwing to prevent the whole API from crashing
    // just because the NewsAPI failed or rate limited us.
    return []; 
  }
};
