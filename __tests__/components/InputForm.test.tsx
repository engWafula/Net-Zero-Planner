import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FormInput from '@/app/components/FormInput';

describe('FormInput Component', () => {
  it('toggles password visibility when password type is provided', () => {
    const handleChange = jest.fn();
    
    render(
      <FormInput
        label="Password"
        type="password"
        name="password"
        value="password123"
        onChange={handleChange}
      />
    );

    const input = screen.getByLabelText('Password');
    expect(input).toHaveAttribute('type', 'password');

    const eyeIcon = screen.getByTestId('eye-icon');
    expect(eyeIcon).toBeInTheDocument();

    fireEvent.click(eyeIcon);

    // Ensure the input type is now 'text'
    expect(input).toHaveAttribute('type', 'text');

    // Ensure the eye slash icon is visible
    const eyeSlashIcon = screen.getByTestId('eye-slash-icon');
    expect(eyeSlashIcon).toBeInTheDocument();

    // Click the eye slash icon to toggle visibility back
    fireEvent.click(eyeSlashIcon);

    // Ensure the input type is back to 'password'
    expect(input).toHaveAttribute('type', 'password');
  });
});
