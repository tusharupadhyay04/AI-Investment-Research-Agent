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
  }
  // Fallback to original input if search fails
  return companyName;
};

/**
 * Fetches company financial overview from Yahoo Finance
 * @param {string} companyNameOrTicker - The stock ticker symbol or company name (e.g., AAPL or Apple)
 * @returns {Object} Structured financial data
 */
export const getCompanyFinancials = async (companyNameOrTicker) => {
  try {
    // 1. Convert full company name to ticker symbol
    const symbol = await getTickerSymbol(companyNameOrTicker);
    
    // 2. Fetch all necessary modules from Yahoo Finance
    const queryOptions = { modules: ['summaryProfile', 'defaultKeyStatistics', 'financialData', 'summaryDetail'] };
    const result = await yahooFinance.quoteSummary(symbol, queryOptions);

    if (!result) {
      throw new Error(`No financial data found for symbol: ${symbol}`);
    }

    const { summaryProfile, defaultKeyStatistics, financialData, summaryDetail } = result;

    // 3. Structure the data exactly as our AI and Frontend expect
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
    console.error(`Error fetching financial data from Yahoo Finance for ${companyNameOrTicker}:`, error.message);
    // If corporate proxy blocks Yahoo Finance (502 / SSL Error), fallback to Mock Data so the app runs!
    console.warn('⚠️ Network or Proxy Error Detected! Falling back to Mock Data to prevent app crash.');
    return getMockData((typeof symbol !== 'undefined' && symbol) ? symbol.toUpperCase() : companyNameOrTicker.toUpperCase());
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

/**
 * Provides mock financial data when API limits are reached
 */
const getMockData = (symbol) => {
  return {
    company: `${symbol} (MOCK DATA)`,
    overview: `This is a simulated overview for ${symbol} because your network proxy or API limit blocked the request to Yahoo Finance. In a production environment without proxy restrictions, this would be the actual company description.`,
    industry: 'Technology',
    sector: 'Consumer Electronics',
    marketCap: '$2.85T',
    revenue: '$383.28B',
    peRatio: '28.5',
    eps: '6.42',
    profitMargin: '25.31%',
    dividendYield: '0.53%',
    fiftyTwoWeekHigh: '199.62',
    fiftyTwoWeekLow: '164.08',
  };
};
