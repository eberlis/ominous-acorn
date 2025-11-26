import { getCostOfLiving } from '../../lib/costOfLivingData';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { location } = req.query;

  if (!location) {
    return res.status(400).json({ error: 'Location parameter is required' });
  }

  // Simulate API delay
  setTimeout(() => {
    const data = getCostOfLiving(location);

    if (!data) {
      return res.status(404).json({ 
        error: 'Location not found',
        message: 'We don\'t have cost of living data for this location yet. Try: New York, NY • Los Angeles, CA • Chicago, IL'
      });
    }

    res.status(200).json(data);
  }, 500);
}
