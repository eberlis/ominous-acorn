# User Story #005: Investment Allocation and Recommendations

## Story
**As a** user  
**I want** the application to reserve a portion of my income for investments and suggest investment options  
**So that** I can grow my wealth over time through smart investment decisions

## Acceptance Criteria
- Given I have disposable income after essential expenses, tithing, and savings
- When the application calculates my budget
- Then it should:
  - Suggest an appropriate percentage for investment (e.g., 15-20% of income)
  - Allow me to set my own investment allocation percentage
  - Display available amount for investment each month
- The application should provide investment recommendations based on:
  - My age and time horizon
  - Risk tolerance (assessed through questionnaire)
  - Financial goals
  - Current market conditions
- Investment suggestions should include:
  - Index funds and ETFs
  - Retirement accounts (401k, IRA, etc.)
  - Bonds
  - Real estate investment trusts (REITs)
  - High-yield savings accounts
- Each suggestion should include:
  - Expected return range
  - Risk level
  - Minimum investment amount
  - Liquidity information
  - Educational resources/links
- I should receive a disclaimer that investment advice is educational and I should consult a financial advisor
- I should be able to track my investment portfolio performance (if connected)

## Priority
Medium

## Story Points
13

## Labels
- feature
- investment
- financial-planning
- ai-powered

## Dependencies
- #001 Location-Based Budget Suggestions
- #003 Savings and Emergency Fund Management
- #007 Expense Tracking and Categorization

## Technical Notes
- Create risk assessment questionnaire
- Integrate with investment data APIs (market data)
- Implement investment recommendation algorithm
- Display clear disclaimers about financial advice
- Optional: Integrate with brokerage APIs for portfolio tracking
- Ensure compliance with financial advisory regulations

## Related Stories
- #006 Dashboard Overview
- #008 Financial Goals and Milestones

---
*Created: November 26, 2025*
