import { getCostOfLiving, getAllCities } from './costOfLivingData';

describe('costOfLivingData', () => {
  describe('getCostOfLiving', () => {
    it('should return cost of living data for valid location', () => {
      const data = getCostOfLiving('New York, NY');
      
      expect(data).toBeDefined();
      expect(data.city).toBe('New York');
      expect(data.state).toBe('NY');
      expect(data.budget).toBeDefined();
      expect(data.budget.housing).toBeGreaterThan(0);
    });

    it('should be case insensitive', () => {
      const data1 = getCostOfLiving('NEW YORK, NY');
      const data2 = getCostOfLiving('new york, ny');
      const data3 = getCostOfLiving('New York, NY');
      
      expect(data1).toEqual(data2);
      expect(data2).toEqual(data3);
    });

    it('should handle leading and trailing whitespace', () => {
      const data = getCostOfLiving('  Chicago, IL  ');
      
      expect(data).toBeDefined();
      expect(data.city).toBe('Chicago');
    });

    it('should return null for invalid location', () => {
      const data = getCostOfLiving('Unknown City, XX');
      
      expect(data).toBeNull();
    });

    it('should return data with all required budget categories', () => {
      const data = getCostOfLiving('Los Angeles, CA');
      
      expect(data.budget).toHaveProperty('housing');
      expect(data.budget).toHaveProperty('food');
      expect(data.budget).toHaveProperty('transportation');
      expect(data.budget).toHaveProperty('utilities');
      expect(data.budget).toHaveProperty('entertainment');
      expect(data.budget).toHaveProperty('healthcare');
      expect(data.budget).toHaveProperty('other');
    });
  });

  describe('getAllCities', () => {
    it('should return array of city names', () => {
      const cities = getAllCities();
      
      expect(Array.isArray(cities)).toBe(true);
      expect(cities.length).toBeGreaterThan(0);
    });

    it('should return cities in correct format', () => {
      const cities = getAllCities();
      
      cities.forEach(city => {
        expect(city).toMatch(/^[A-Za-z\s]+,\s[A-Z]{2}$/);
      });
    });

    it('should include major cities', () => {
      const cities = getAllCities();
      
      expect(cities).toContain('New York, NY');
      expect(cities).toContain('Los Angeles, CA');
      expect(cities).toContain('Chicago, IL');
    });
  });
});
