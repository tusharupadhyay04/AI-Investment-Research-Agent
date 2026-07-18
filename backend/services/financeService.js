import axios from 'axios';
import yahooFinanceDefault from 'yahoo-finance2';
import dotenv from 'dotenv';

dotenv.config();

// Fixes corporate proxy SSL issues for Node.js native fetch (which Yahoo Finance uses)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Instantiate Yahoo Finance (v3 syntax requirement)
const yahooFinance = new yahooFinanceDefault();

/**
 * Helper to find the stock ticker symbol from a company name using Yahoo Finance
 */
export const getTickerSymbol = async (companyName) => {
  try {
    const results = await yahooFinance.search(companyName);
    
    if (results.quotes && results.quotes.length > 0) {
      // Find the first equity result to avoid returning indices or crypto unless specifically asked
      const equity = results.quotes.find(q => q.quoteType === 'EQUITY');
      return equity ? equity.symbol : results.quotes[0].symbol;
    }
  } catch (err) {
    console.error('Yahoo Finance search failed:', err.message);
    console.log('Attempting to use input as ticker symbol fallback.');
    return companyName.toUpperCase(); // Fallback to raw input for Alpha Vantage
  }
  
  // If we found no quotes
  throw new Error(`Could not find a valid stock ticker for: ${companyName}`);
};

/**
 * Fetches company financial overview from Yahoo Finance with Alpha Vantage fallback
 * @param {string} companyNameOrTicker - The stock ticker symbol or company name (e.g., AAPL or Apple)
 * @returns {Object} Structured financial data
 */
export const getCompanyFinancials = async (companyNameOrTicker) => {
  let symbol = companyNameOrTicker;
  
  try {
    symbol = await getTickerSymbol(companyNameOrTicker);
    
    const queryOptions = { modules: ['summaryProfile', 'defaultKeyStatistics', 'financialData', 'summaryDetail'] };
    const result = await yahooFinance.quoteSummary(symbol, queryOptions);

    if (!result) {
      throw new Error(`No financial data found for symbol: ${symbol}`);
    }

    const { summaryProfile, defaultKeyStatistics, financialData, summaryDetail } = result;

    return {
      company: symbol,
      overview: summaryProfile?.longBusinessSummary || 'No description available.',
      industry: summaryProfile?.industry || 'Unknown',
      sector: summaryProfile?.sector || 'Unknown',
      marketCap: summaryDetail?.marketCap ? formatCurrency(summaryDetail.marketCap) : 'N/A',
      revenue: financialData?.totalRevenue ? formatCurrency(financialData.totalRevenue) : 'N/A',
      peRatio: summaryDetail?.trailingPE ? summaryDetail.trailingPE.toFixed(2) : 'N/A',
      eps: defaultKeyStatistics?.trailingEps ? defaultKeyStatistics.trailingEps.toFixed(2) : 'N/A',
      profitMargin: financialData?.profitMargins ? `${(financialData.profitMargins * 100).toFixed(2)}%` : 'N/A',
      dividendYield: summaryDetail?.dividendYield ? `${(summaryDetail.dividendYield * 100).toFixed(2)}%` : 'N/A',
      fiftyTwoWeekHigh: summaryDetail?.fiftyTwoWeekHigh ? summaryDetail.fiftyTwoWeekHigh.toFixed(2) : 'N/A',
      fiftyTwoWeekLow: summaryDetail?.fiftyTwoWeekLow ? summaryDetail.fiftyTwoWeekLow.toFixed(2) : 'N/A',
    };
  } catch (error) {
    console.error(`Error fetching from Yahoo Finance for ${companyNameOrTicker}:`, error.message);
    console.log(`Attempting fallback to Alpha Vantage for symbol: ${symbol}`);
    
    try {
      const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
      if (!apiKey) throw new Error('No Alpha Vantage API key configured.');
      
      const response = await axios.get(`https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${apiKey}`);
      const data = response.data;
      
      if (!data || Object.keys(data).length === 0 || data.Information) {
         throw new Error('Alpha Vantage returned no data or rate limit reached.');
      }
      
      return {
        company: symbol,
        overview: data.Description || 'No description available.',
        industry: data.Industry || 'Unknown',
        sector: data.Sector || 'Unknown',
        marketCap: data.MarketCapitalization ? formatCurrency(data.MarketCapitalization) : 'N/A',
        revenue: data.RevenueTTM ? formatCurrency(data.RevenueTTM) : 'N/A',
        peRatio: data.PERatio && data.PERatio !== '-' ? parseFloat(data.PERatio).toFixed(2) : 'N/A',
        eps: data.EPS && data.EPS !== '-' ? parseFloat(data.EPS).toFixed(2) : 'N/A',
        profitMargin: data.ProfitMargin && data.ProfitMargin !== '-' ? `${(parseFloat(data.ProfitMargin) * 100).toFixed(2)}%` : 'N/A',
        dividendYield: data.DividendYield && data.DividendYield !== '-' ? `${(parseFloat(data.DividendYield) * 100).toFixed(2)}%` : 'N/A',
        fiftyTwoWeekHigh: data.52WeekHigh && data.52WeekHigh !== '-' ? parseFloat(data.52WeekHigh).toFixed(2) : 'N/A',
        fiftyTwoWeekLow: data.52WeekLow && data.52WeekLow !== '-' ? parseFloat(data.52WeekLow).toFixed(2) : 'N/A',
      };
    } catch (avError) {
      console.error('Alpha Vantage Fallback failed:', avError.message);
      throw new Error(`Failed to fetch financial data from both Yahoo Finance and Alpha Vantage. ${error.message}`);
    }
  }
};

/**
 * Fetches historical daily close prices for the last 6 months.
 * @param {string} companyNameOrTicker 
 * @returns {Array} Array of { date, price }
 */
export const getHistoricalData = async (companyNameOrTicker) => {
  try {
    const symbol = await getTickerSymbol(companyNameOrTicker);
    
    // Calculate date range (6 months ago to today)
    const period2 = new Date();
    const period1 = new Date();
    period1.setMonth(period1.getMonth() - 6);

    const queryOptions = {
      period1: period1.toISOString().split('T')[0],
      period2: period2.toISOString().split('T')[0],
      interval: '1d'
    };

    const results = await yahooFinance.historical(symbol, queryOptions);
    
    // Map to a cleaner format for recharts
    return results.map(item => ({
      date: item.date.toISOString().split('T')[0],
      price: item.close
    }));
  } catch (error) {
    console.error(`Error fetching historical data for ${companyNameOrTicker}:`, error.message);
    return []; // Return empty array if charting data fails, so it doesn't break the whole app
  }
};

/**
 * Helper function to format large numbers into human-readable currency (e.g., Billions, Trillions)
 */
const formatCurrency = (value) => {
  const num = Number(value);
  if (isNaN(num)) return value;
  
  if (num >= 1.0e12) {
    return `$${(num / 1.0e12).toFixed(2)}T`;
  } else if (num >= 1.0e9) {
    return `$${(num / 1.0e9).toFixed(2)}B`;
  } else if (num >= 1.0e6) {
    return `$${(num / 1.0e6).toFixed(2)}M`;
  } else {
    return `$${num.toLocaleString()}`;
  }
};

