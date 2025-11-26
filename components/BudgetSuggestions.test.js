import { render, screen, fireEvent } from '@testing-library/react';
import BudgetSuggestions from './BudgetSuggestions';

const mockLocationData = {
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
};

describe('BudgetSuggestions', () => {
  it('should render budget suggestions with location name', () => {
    const mockOnReset = jest.fn();
    render(<BudgetSuggestions locationData={mockLocationData} onReset={mockOnReset} />);
    
    expect(screen.getByText(/budget suggestions for new york, ny/i)).toBeInTheDocument();
  });

  it('should display all budget categories', () => {
    const mockOnReset = jest.fn();
    render(<BudgetSuggestions locationData={mockLocationData} onReset={mockOnReset} />);
    
    expect(screen.getByText(/housing/i)).toBeInTheDocument();
    expect(screen.getByText(/food & groceries/i)).toBeInTheDocument();
    expect(screen.getByText(/transportation/i)).toBeInTheDocument();
    expect(screen.getByText(/utilities/i)).toBeInTheDocument();
    expect(screen.getByText(/entertainment & leisure/i)).toBeInTheDocument();
    expect(screen.getByText(/healthcare/i)).toBeInTheDocument();
    expect(screen.getByText(/other expenses/i)).toBeInTheDocument();
  });

  it('should calculate and display total budget', () => {
    const mockOnReset = jest.fn();
    render(<BudgetSuggestions locationData={mockLocationData} onReset={mockOnReset} />);
    
    const expectedTotal = 3000 + 600 + 150 + 180 + 300 + 450 + 320;
    expect(screen.getByText(`$${expectedTotal.toLocaleString()}`)).toBeInTheDocument();
  });

  it('should enable editing mode when adjust budget button is clicked', () => {
    const mockOnReset = jest.fn();
    render(<BudgetSuggestions locationData={mockLocationData} onReset={mockOnReset} />);
    
    const adjustButton = screen.getByRole('button', { name: /adjust budget/i });
    fireEvent.click(adjustButton);
    
    expect(screen.getByRole('button', { name: /done editing/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reset to suggested/i })).toBeInTheDocument();
  });

  it('should allow editing budget values', () => {
    const mockOnReset = jest.fn();
    render(<BudgetSuggestions locationData={mockLocationData} onReset={mockOnReset} />);
    
    // Enable editing
    const adjustButton = screen.getByRole('button', { name: /adjust budget/i });
    fireEvent.click(adjustButton);
    
    // Find and update housing input
    const inputs = screen.getAllByRole('spinbutton');
    const housingInput = inputs[0]; // First input is housing
    
    fireEvent.change(housingInput, { target: { value: '3500' } });
    expect(housingInput.value).toBe('3500');
  });

  it('should reset to original values when reset button is clicked', () => {
    const mockOnReset = jest.fn();
    render(<BudgetSuggestions locationData={mockLocationData} onReset={mockOnReset} />);
    
    // Enable editing
    fireEvent.click(screen.getByRole('button', { name: /adjust budget/i }));
    
    // Change a value
    const inputs = screen.getAllByRole('spinbutton');
    fireEvent.change(inputs[0], { target: { value: '3500' } });
    
    // Reset
    fireEvent.click(screen.getByRole('button', { name: /reset to suggested/i }));
    
    // Should show original value
    expect(inputs[0].value).toBe('3500');
  });

  it('should call onReset when change location button is clicked', () => {
    const mockOnReset = jest.fn();
    render(<BudgetSuggestions locationData={mockLocationData} onReset={mockOnReset} />);
    
    const changeLocationButton = screen.getByRole('button', { name: /change location/i });
    fireEvent.click(changeLocationButton);
    
    expect(mockOnReset).toHaveBeenCalledTimes(1);
  });

  it('should calculate percentages correctly', () => {
    const mockOnReset = jest.fn();
    render(<BudgetSuggestions locationData={mockLocationData} onReset={mockOnReset} />);
    
    const total = 5000;
    const housingPercentage = ((3000 / total) * 100).toFixed(1);
    
    expect(screen.getByText(`${housingPercentage}% of total`)).toBeInTheDocument();
  });

  it('should return null when no locationData is provided', () => {
    const mockOnReset = jest.fn();
    const { container } = render(<BudgetSuggestions locationData={null} onReset={mockOnReset} />);
    
    expect(container.firstChild).toBeNull();
  });
});
