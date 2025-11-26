# Location-Based Budget Suggestions Feature

## Overview
This feature provides personalized budget suggestions based on the user's location and local cost of living data.

## Implementation Details

### Components Created

1. **LocationInput** (`components/LocationInput.js`)
   - Accepts user's location input
   - Validates input before submission
   - Provides helpful hints for supported cities

2. **BudgetSuggestions** (`components/BudgetSuggestions.js`)
   - Displays budget breakdown by category
   - Allows users to adjust suggested amounts
   - Shows percentage allocation for each category
   - Calculates total monthly budget

### API Endpoints

**GET /api/cost-of-living**
- Query params: `location` (string)
- Returns cost of living data including budget breakdown
- Returns 404 if location not found

### Data Structure

Budget categories included:
- 🏠 Housing
- 🍎 Food & Groceries
- 🚗 Transportation
- 💡 Utilities
- 🎭 Entertainment & Leisure
- ⚕️ Healthcare
- 📦 Other Expenses

### Currently Supported Cities

- New York, NY
- Los Angeles, CA
- Chicago, IL
- Austin, TX
- Miami, FL
- Seattle, WA
- Boston, MA
- Denver, CO

### Features

✅ Location-based budget calculation
✅ Adjustable budget values
✅ Percentage breakdown visualization
✅ Responsive design
✅ Loading states
✅ Error handling
✅ Accessibility support
✅ Unit tests

## Usage

1. Enter your city and state (e.g., "New York, NY")
2. Click "Get Budget Suggestions"
3. Review the suggested budget breakdown
4. Click "Adjust Budget" to customize any category
5. Click "Reset to Suggested" to restore original values
6. Click "Change Location" to start over

## Testing

Run tests with:
```bash
npm test
```

Run tests in watch mode:
```bash
npm test:watch
```

Run tests with coverage:
```bash
npm test:coverage
```

## Future Enhancements

- Integration with real cost of living APIs (Numbeo, Expatistan)
- Support for international locations
- Historical trend data
- Comparison between multiple cities
- Save budget preferences to user profile
- Export budget as PDF or CSV
- Budget vs. actual spending tracking

## Technical Notes

### Caching Strategy
Currently uses static data. In production:
- Cache API responses for 24 hours
- Implement Redis or similar for distributed caching
- Add background job to refresh data daily

### API Integration
To integrate with real cost of living API:
1. Sign up for API key (Numbeo or Expatistan)
2. Update `lib/costOfLivingData.js` to call external API
3. Add API key to `.env.local`
4. Implement rate limiting and error handling

### Data Privacy
- Location data stored only in browser session
- No personally identifiable information collected
- Can be cleared by changing location or refreshing page

## Acceptance Criteria Status

✅ User can enter location (city/region)
✅ Application provides recommended monthly budget breakdown
✅ Budget includes all specified categories
✅ Budget based on average cost of living data
✅ Budget is adjustable by user
✅ Clean, intuitive UI
✅ Mobile responsive
✅ Accessible to screen readers
✅ Comprehensive test coverage
