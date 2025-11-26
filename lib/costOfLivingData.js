// Mock cost of living data for different cities
// In production, this would be replaced with actual API calls to Numbeo or similar services

export const costOfLivingData = {
  'new york, ny': {
    city: 'New York',
    state: 'NY',
    country: 'USA',
    currency: 'USD',
    budget: {
      housing: 3000,
      food: 600,
      transportation: 150,
      utilities: 180,
      entertainment: 300,
      healthcare: 450,
      other: 320
    }
  },
  'los angeles, ca': {
    city: 'Los Angeles',
    state: 'CA',
    country: 'USA',
    currency: 'USD',
    budget: {
      housing: 2500,
      food: 550,
      transportation: 200,
      utilities: 160,
      entertainment: 280,
      healthcare: 400,
      other: 310
    }
  },
  'chicago, il': {
    city: 'Chicago',
    state: 'IL',
    country: 'USA',
    currency: 'USD',
    budget: {
      housing: 1800,
      food: 500,
      transportation: 130,
      utilities: 150,
      entertainment: 250,
      healthcare: 380,
      other: 290
    }
  },
  'austin, tx': {
    city: 'Austin',
    state: 'TX',
    country: 'USA',
    currency: 'USD',
    budget: {
      housing: 1600,
      food: 480,
      transportation: 140,
      utilities: 170,
      entertainment: 270,
      healthcare: 360,
      other: 280
    }
  },
  'miami, fl': {
    city: 'Miami',
    state: 'FL',
    country: 'USA',
    currency: 'USD',
    budget: {
      housing: 2200,
      food: 520,
      transportation: 160,
      utilities: 190,
      entertainment: 290,
      healthcare: 370,
      other: 300
    }
  },
  'seattle, wa': {
    city: 'Seattle',
    state: 'WA',
    country: 'USA',
    currency: 'USD',
    budget: {
      housing: 2400,
      food: 580,
      transportation: 140,
      utilities: 170,
      entertainment: 300,
      healthcare: 420,
      other: 310
    }
  },
  'boston, ma': {
    city: 'Boston',
    state: 'MA',
    country: 'USA',
    currency: 'USD',
    budget: {
      housing: 2600,
      food: 590,
      transportation: 120,
      utilities: 180,
      entertainment: 290,
      healthcare: 440,
      other: 320
    }
  },
  'denver, co': {
    city: 'Denver',
    state: 'CO',
    country: 'USA',
    currency: 'USD',
    budget: {
      housing: 1900,
      food: 520,
      transportation: 150,
      utilities: 160,
      entertainment: 280,
      healthcare: 390,
      other: 300
    }
  }
};

export function getCostOfLiving(location) {
  const normalizedLocation = location.toLowerCase().trim();
  return costOfLivingData[normalizedLocation] || null;
}

export function getAllCities() {
  return Object.keys(costOfLivingData).map(key => {
    const data = costOfLivingData[key];
    return `${data.city}, ${data.state}`;
  });
}
