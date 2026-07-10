import { PromptTemplate } from '@langchain/core/prompts';

export const investmentPrompt = new PromptTemplate({
  template: `

Company: {company}
Industry: {industry}
Sector: {sector}

Financial Fundamentals:
Market Cap: {marketCap}
Revenue: {revenue}
PE Ratio: {peRatio}
EPS: {eps}
Profit Margin: {profitMargin}
Dividend Yield: {dividendYield}
52 Week High: {fiftyTwoWeekHigh}
52 Week Low: {fiftyTwoWeekLow}

Recent News & Sentiment:
{newsContext}





{{
  "investmentScore": <Number between 0 and 100 representing the overall investment attractiveness>,
  "confidenceScore": <Number between 0 and 100 representing your confidence in this analysis based on data availability>,
  "riskLevel": "<Low | Medium | High | Extreme>",
  "recommendation": "<INVEST | HOLD | PASS>",
  "pros": [
    "<String detailing a positive aspect or strength>",
    "<String detailing another positive aspect>"
  ],
  "cons": [
    "<String detailing a negative aspect or risk>",
    "<String detailing another negative aspect>"
  ],
  "summary": "<A detailed, professional summary (3-4 sentences) explaining your reasoning for the recommendation.>"
}}
`,
  inputVariables: [
    "company",
    "industry",
    "sector",
    "marketCap",
    "revenue",
    "peRatio",
    "eps",
    "profitMargin",
    "dividendYield",
    "fiftyTwoWeekHigh",
    "fiftyTwoWeekLow",
    "newsContext"
  ]
});
