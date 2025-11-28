/**
 * Expense Categories and Constants
 * Defines predefined categories, icons, and merchant mappings for expense tracking
 */

export const EXPENSE_CATEGORIES = {
  HOUSING: {
    id: 'housing',
    name: 'Housing',
    icon: '🏠',
    color: '#4A90E2',
    subcategories: ['Rent', 'Mortgage', 'Property Tax', 'Home Insurance', 'HOA Fees', 'Maintenance']
  },
  UTILITIES: {
    id: 'utilities',
    name: 'Utilities',
    icon: '💡',
    color: '#F5A623',
    subcategories: ['Electricity', 'Water', 'Gas', 'Internet', 'Phone', 'Trash']
  },
  FOOD: {
    id: 'food',
    name: 'Food & Dining',
    icon: '🍽️',
    color: '#E74C3C',
    subcategories: ['Groceries', 'Restaurants', 'Fast Food', 'Coffee Shops', 'Delivery']
  },
  TRANSPORTATION: {
    id: 'transportation',
    name: 'Transportation',
    icon: '🚗',
    color: '#9B59B6',
    subcategories: ['Gas', 'Public Transit', 'Car Payment', 'Car Insurance', 'Maintenance', 'Parking', 'Rideshare']
  },
  HEALTHCARE: {
    id: 'healthcare',
    name: 'Healthcare',
    icon: '⚕️',
    color: '#1ABC9C',
    subcategories: ['Insurance', 'Doctor Visits', 'Prescriptions', 'Dental', 'Vision', 'Medical Supplies']
  },
  ENTERTAINMENT: {
    id: 'entertainment',
    name: 'Entertainment',
    icon: '🎮',
    color: '#E67E22',
    subcategories: ['Streaming Services', 'Movies', 'Games', 'Concerts', 'Hobbies', 'Books']
  },
  SHOPPING: {
    id: 'shopping',
    name: 'Shopping',
    icon: '🛍️',
    color: '#3498DB',
    subcategories: ['Clothing', 'Electronics', 'Home Goods', 'Gifts', 'Personal Care']
  },
  EDUCATION: {
    id: 'education',
    name: 'Education',
    icon: '📚',
    color: '#16A085',
    subcategories: ['Tuition', 'Books', 'Courses', 'School Supplies', 'Student Loans']
  },
  PERSONAL: {
    id: 'personal',
    name: 'Personal Care',
    icon: '💆',
    color: '#F39C12',
    subcategories: ['Haircut', 'Gym', 'Spa', 'Beauty Products', 'Laundry', 'Dry Cleaning']
  },
  TRAVEL: {
    id: 'travel',
    name: 'Travel',
    icon: '✈️',
    color: '#2ECC71',
    subcategories: ['Flights', 'Hotels', 'Vacation', 'Business Travel']
  },
  INSURANCE: {
    id: 'insurance',
    name: 'Insurance',
    icon: '🛡️',
    color: '#34495E',
    subcategories: ['Life Insurance', 'Health Insurance', 'Home Insurance', 'Auto Insurance']
  },
  DEBT: {
    id: 'debt',
    name: 'Debt Payments',
    icon: '💳',
    color: '#C0392B',
    subcategories: ['Credit Card', 'Personal Loan', 'Student Loan', 'Car Loan', 'Other Debt']
  },
  SAVINGS: {
    id: 'savings',
    name: 'Savings',
    icon: '💰',
    color: '#27AE60',
    subcategories: ['Emergency Fund', 'Retirement', 'Investment', 'General Savings']
  },
  CHARITY: {
    id: 'charity',
    name: 'Charity & Tithing',
    icon: '🙏',
    color: '#8E44AD',
    subcategories: ['Tithing', 'Donations', 'Charity', 'Offering']
  },
  PETS: {
    id: 'pets',
    name: 'Pets',
    icon: '🐾',
    color: '#D35400',
    subcategories: ['Pet Food', 'Vet', 'Pet Insurance', 'Grooming', 'Pet Supplies']
  },
  OTHER: {
    id: 'other',
    name: 'Other',
    icon: '📦',
    color: '#95A5A6',
    subcategories: ['Miscellaneous']
  }
};

// Flatten categories for easy access
export const CATEGORIES_LIST = Object.values(EXPENSE_CATEGORIES);

// Get category by id
export function getCategoryById(id) {
  return CATEGORIES_LIST.find(cat => cat.id === id) || EXPENSE_CATEGORIES.OTHER;
}

// Merchant name patterns for AI categorization
export const MERCHANT_PATTERNS = {
  housing: [
    /rent/i, /landlord/i, /property management/i, /mortgage/i, /hoa/i
  ],
  utilities: [
    /electric/i, /power/i, /energy/i, /water/i, /gas company/i, /internet/i, 
    /comcast/i, /verizon/i, /at&t/i, /spectrum/i, /xfinity/i, /cox/i
  ],
  food: [
    /grocery/i, /supermarket/i, /whole foods/i, /trader joe/i, /safeway/i, 
    /kroger/i, /walmart/i, /costco/i, /restaurant/i, /cafe/i, /coffee/i,
    /starbucks/i, /dunkin/i, /mcdonald/i, /burger/i, /pizza/i, /chipotle/i,
    /doordash/i, /uber eats/i, /grubhub/i, /postmates/i
  ],
  transportation: [
    /gas station/i, /fuel/i, /shell/i, /chevron/i, /bp/i, /exxon/i, /mobil/i,
    /uber/i, /lyft/i, /taxi/i, /transit/i, /metro/i, /parking/i, /toll/i,
    /auto insurance/i, /car wash/i, /jiffy lube/i
  ],
  healthcare: [
    /pharmacy/i, /cvs/i, /walgreens/i, /rite aid/i, /hospital/i, /clinic/i,
    /doctor/i, /dental/i, /vision/i, /medical/i, /health/i
  ],
  entertainment: [
    /netflix/i, /hulu/i, /disney/i, /spotify/i, /apple music/i, /youtube/i,
    /hbo/i, /amazon prime/i, /movie/i, /cinema/i, /theater/i, /game/i, 
    /steam/i, /playstation/i, /xbox/i, /nintendo/i
  ],
  shopping: [
    /amazon/i, /target/i, /best buy/i, /apple store/i, /mall/i, /clothing/i,
    /fashion/i, /nordstrom/i, /macy/i, /home depot/i, /lowe/i, /ikea/i
  ],
  education: [
    /university/i, /college/i, /school/i, /tuition/i, /books/i, /coursera/i,
    /udemy/i, /edx/i, /student loan/i
  ],
  personal: [
    /gym/i, /fitness/i, /salon/i, /spa/i, /haircut/i, /barber/i, /massage/i,
    /yoga/i, /pilates/i, /laundry/i, /dry clean/i
  ],
  travel: [
    /airline/i, /flight/i, /hotel/i, /airbnb/i, /vrbo/i, /expedia/i, 
    /booking.com/i, /kayak/i, /travel/i
  ],
  insurance: [
    /insurance/i, /state farm/i, /geico/i, /progressive/i, /allstate/i
  ],
  debt: [
    /credit card/i, /loan payment/i, /paypal credit/i, /affirm/i, /afterpay/i
  ],
  charity: [
    /church/i, /donation/i, /charity/i, /tithing/i, /offering/i, /non-profit/i
  ],
  pets: [
    /pet/i, /vet/i, /veterinary/i, /petsmart/i, /petco/i, /chewy/i
  ]
};

// Transaction frequency options
export const FREQUENCY_OPTIONS = [
  { value: 'once', label: 'One-time' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Bi-weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' }
];

// Payment methods
export const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash', icon: '💵' },
  { value: 'debit', label: 'Debit Card', icon: '💳' },
  { value: 'credit', label: 'Credit Card', icon: '💳' },
  { value: 'check', label: 'Check', icon: '📝' },
  { value: 'transfer', label: 'Bank Transfer', icon: '🏦' },
  { value: 'digital', label: 'Digital Wallet', icon: '📱' },
  { value: 'other', label: 'Other', icon: '💰' }
];

// Expense status
export const EXPENSE_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};
