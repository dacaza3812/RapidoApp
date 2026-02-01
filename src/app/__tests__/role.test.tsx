import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Role from '../role';
import { router } from 'expo-router';

jest.mock('expo-router', () => ({
  router: {
    navigate: jest.fn(),
  },
}));

describe('Role Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText, getByTestId } = render(<Role />);
    
    expect(getByText('Elija su tipo de usuario')).toBeTruthy();
    expect(getByText('Cliente')).toBeTruthy();
    expect(getByText('Chofer')).toBeTruthy();
    expect(getByText('Ordena un viaje o entrega facilmente')).toBeTruthy();
    expect(getByText('Únete a nosotros, maneja y entrega')).toBeTruthy();
  });

  it('navigates to customer auth when customer card is pressed', () => {
    const { getByTestId } = render(<Role />);
    
    const customerCard = getByTestId('customer-card');
    fireEvent.press(customerCard);
    
    expect(router.navigate).toHaveBeenCalledWith('/customer/auth');
  });

  it('navigates to captain auth when captain card is pressed', () => {
    const { getByTestId } = render(<Role />);
    
    const captainCard = getByTestId('captain-card');
    fireEvent.press(captainCard);
    
    expect(router.navigate).toHaveBeenCalledWith('/captain/auth');
  });

  it('has accessibility labels on interactive elements', () => {
    const { getByTestId } = render(<Role />);
    
    const customerCard = getByTestId('customer-card');
    const captainCard = getByTestId('captain-card');
    
    expect(customerCard.props.accessibilityRole).toBe('button');
    expect(customerCard.props.accessibilityLabel).toBe('Cliente');
    expect(captainCard.props.accessibilityRole).toBe('button');
    expect(captainCard.props.accessibilityLabel).toBe('Chofer');
  });

  it('matches snapshot', () => {
    const tree = render(<Role />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
