import { render, screen, fireEvent } from '@testing-library/react';
import SavingsGoals from './SavingsGoals';

const mockGoals = [
  {
    id: 'goal_1',
    name: 'Summer Vacation',
    type: 'vacation',
    targetAmount: 5000,
    currentAmount: 2500,
    monthlyTarget: 500
  },
  {
    id: 'goal_2',
    name: 'New Car',
    type: 'car',
    targetAmount: 20000,
    currentAmount: 5000,
    monthlyTarget: 800
  }
];

const mockEmergencyFund = {
  targetAmount: 15000,
  currentAmount: 5000,
  monthsOfExpenses: 3,
  monthlyExpenses: 5000
};

const defaultProps = {
  goals: mockGoals,
  emergencyFund: mockEmergencyFund,
  monthlyExpenses: 5000,
  monthlySavings: 1000,
  onAddGoal: jest.fn(),
  onEditGoal: jest.fn(),
  onDeleteGoal: jest.fn(),
  onAddContribution: jest.fn(),
  onUpdateEmergencyFund: jest.fn()
};

describe('SavingsGoals', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render overview section with total saved', () => {
    render(<SavingsGoals {...defaultProps} />);
    
    expect(screen.getByText('Total Saved')).toBeInTheDocument();
  });

  it('should display active goals count', () => {
    render(<SavingsGoals {...defaultProps} />);
    
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('savings goals')).toBeInTheDocument();
  });

  it('should render emergency fund section', () => {
    render(<SavingsGoals {...defaultProps} />);
    
    expect(screen.getByText(/Emergency Fund/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /configure/i })).toBeInTheDocument();
  });

  it('should render savings goals section', () => {
    render(<SavingsGoals {...defaultProps} />);
    
    expect(screen.getByText(/Savings Goals/)).toBeInTheDocument();
    expect(screen.getByText('Summer Vacation')).toBeInTheDocument();
    expect(screen.getByText('New Car')).toBeInTheDocument();
  });

  it('should show add goal form when Add Goal button is clicked', () => {
    render(<SavingsGoals {...defaultProps} />);
    
    const addButton = screen.getByRole('button', { name: /add goal/i });
    fireEvent.click(addButton);
    
    expect(screen.getByText('New Savings Goal')).toBeInTheDocument();
    expect(screen.getByLabelText(/goal name/i)).toBeInTheDocument();
  });

  it('should show empty state when no goals exist', () => {
    render(<SavingsGoals {...defaultProps} goals={[]} />);
    
    expect(screen.getByText('No savings goals yet')).toBeInTheDocument();
    expect(screen.getByText(/create your first goal/i)).toBeInTheDocument();
  });

  it('should show progress bars for goals', () => {
    render(<SavingsGoals {...defaultProps} />);
    
    // Should show progress percentages
    expect(screen.getByText('50.0%')).toBeInTheDocument(); // Summer Vacation: 2500/5000
    expect(screen.getByText('25.0%')).toBeInTheDocument(); // New Car: 5000/20000
  });

  it('should display milestone information', () => {
    render(<SavingsGoals {...defaultProps} />);
    
    // Check for milestone indicators
    expect(screen.getAllByText(/milestones reached/i).length).toBeGreaterThan(0);
  });

  it('should call onAddGoal when form is submitted', () => {
    const onAddGoal = jest.fn();
    render(<SavingsGoals {...defaultProps} onAddGoal={onAddGoal} />);
    
    // Open form
    fireEvent.click(screen.getByRole('button', { name: /add goal/i }));
    
    // Fill form
    fireEvent.change(screen.getByLabelText(/goal name/i), {
      target: { value: 'New Goal' }
    });
    fireEvent.change(screen.getByLabelText(/target amount/i), {
      target: { value: '10000' }
    });
    
    // Submit
    fireEvent.click(screen.getByRole('button', { name: /create goal/i }));
    
    expect(onAddGoal).toHaveBeenCalledTimes(1);
    expect(onAddGoal).toHaveBeenCalledWith(expect.objectContaining({
      name: 'New Goal',
      targetAmount: 10000
    }));
  });

  it('should call onDeleteGoal when delete button is clicked', () => {
    const onDeleteGoal = jest.fn();
    render(<SavingsGoals {...defaultProps} onDeleteGoal={onDeleteGoal} />);
    
    const deleteButtons = screen.getAllByRole('button', { name: /delete goal/i });
    fireEvent.click(deleteButtons[0]);
    
    expect(onDeleteGoal).toHaveBeenCalledWith('goal_1');
  });

  it('should show emergency fund configuration form', () => {
    render(<SavingsGoals {...defaultProps} />);
    
    fireEvent.click(screen.getByRole('button', { name: /configure/i }));
    
    expect(screen.getByText(/months of expenses to cover/i)).toBeInTheDocument();
    expect(screen.getByText('3 months')).toBeInTheDocument();
    expect(screen.getByText('6 months')).toBeInTheDocument();
  });

  it('should display remaining amount to goal', () => {
    render(<SavingsGoals {...defaultProps} />);
    
    // Summer Vacation: $2,500 to go
    expect(screen.getByText('$2,500.00 to go')).toBeInTheDocument();
    // New Car: $15,000 to go
    expect(screen.getByText('$15,000.00 to go')).toBeInTheDocument();
  });

  it('should show contribution form when Add Contribution is clicked', () => {
    render(<SavingsGoals {...defaultProps} />);
    
    const addContributionButtons = screen.getAllByRole('button', { name: /add contribution/i });
    fireEvent.click(addContributionButtons[0]);
    
    expect(screen.getByPlaceholderText('Amount')).toBeInTheDocument();
  });

  it('should call onAddContribution when contribution is submitted', () => {
    const onAddContribution = jest.fn();
    render(<SavingsGoals {...defaultProps} onAddContribution={onAddContribution} />);
    
    // Open contribution form
    const addContributionButtons = screen.getAllByRole('button', { name: /add contribution/i });
    fireEvent.click(addContributionButtons[0]);
    
    // Enter amount
    fireEvent.change(screen.getByPlaceholderText('Amount'), {
      target: { value: '100' }
    });
    
    // Submit
    fireEvent.click(screen.getByRole('button', { name: /^add$/i }));
    
    expect(onAddContribution).toHaveBeenCalledWith('goal_1', 100);
  });

  it('should display goal type icons', () => {
    render(<SavingsGoals {...defaultProps} />);
    
    // Should show vacation and car icons
    expect(screen.getByText('✈️')).toBeInTheDocument();
    expect(screen.getByText('🚗')).toBeInTheDocument();
  });

  it('should show next milestone information', () => {
    render(<SavingsGoals {...defaultProps} />);
    
    // Check for next milestone text
    const nextMilestones = screen.getAllByText(/next milestone/i);
    expect(nextMilestones.length).toBeGreaterThan(0);
  });

  it('should allow editing a goal', () => {
    render(<SavingsGoals {...defaultProps} />);
    
    const editButtons = screen.getAllByRole('button', { name: /edit goal/i });
    fireEvent.click(editButtons[0]);
    
    // Form should open with goal data
    expect(screen.getByText('Edit Goal')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Summer Vacation')).toBeInTheDocument();
  });

  it('should call onUpdateEmergencyFund when emergency fund form is submitted', () => {
    const onUpdateEmergencyFund = jest.fn();
    render(<SavingsGoals {...defaultProps} onUpdateEmergencyFund={onUpdateEmergencyFund} />);
    
    // Open emergency fund form
    fireEvent.click(screen.getByRole('button', { name: /configure/i }));
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /save emergency fund settings/i }));
    
    expect(onUpdateEmergencyFund).toHaveBeenCalled();
  });
});
