import { render, screen, fireEvent } from '@testing-library/react';
import LocationInput from './LocationInput';

describe('LocationInput', () => {
  it('should render with input field and submit button', () => {
    const mockOnSubmit = jest.fn();
    render(<LocationInput onLocationSubmit={mockOnSubmit} />);
    
    expect(screen.getByLabelText(/enter your location/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /get budget suggestions/i })).toBeInTheDocument();
  });

  it('should call onLocationSubmit with location value when form is submitted', () => {
    const mockOnSubmit = jest.fn();
    render(<LocationInput onLocationSubmit={mockOnSubmit} />);
    
    const input = screen.getByLabelText(/enter your location/i);
    const button = screen.getByRole('button', { name: /get budget suggestions/i });
    
    fireEvent.change(input, { target: { value: 'New York, NY' } });
    fireEvent.click(button);
    
    expect(mockOnSubmit).toHaveBeenCalledWith('New York, NY');
  });

  it('should show error message when submitting empty location', () => {
    const mockOnSubmit = jest.fn();
    render(<LocationInput onLocationSubmit={mockOnSubmit} />);
    
    const button = screen.getByRole('button', { name: /get budget suggestions/i });
    fireEvent.click(button);
    
    expect(screen.getByText(/please enter a location/i)).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should clear error when user types after error', () => {
    const mockOnSubmit = jest.fn();
    render(<LocationInput onLocationSubmit={mockOnSubmit} />);
    
    const input = screen.getByLabelText(/enter your location/i);
    const button = screen.getByRole('button', { name: /get budget suggestions/i });
    
    // Trigger error
    fireEvent.click(button);
    expect(screen.getByText(/please enter a location/i)).toBeInTheDocument();
    
    // Type and submit
    fireEvent.change(input, { target: { value: 'Boston, MA' } });
    fireEvent.click(button);
    
    expect(screen.queryByText(/please enter a location/i)).not.toBeInTheDocument();
    expect(mockOnSubmit).toHaveBeenCalledWith('Boston, MA');
  });

  it('should have proper accessibility attributes', () => {
    const mockOnSubmit = jest.fn();
    render(<LocationInput onLocationSubmit={mockOnSubmit} />);
    
    const input = screen.getByLabelText(/enter your location/i);
    expect(input).toHaveAttribute('aria-label', 'Location input');
  });
});
