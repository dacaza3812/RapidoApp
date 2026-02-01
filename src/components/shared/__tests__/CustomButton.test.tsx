import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CustomButton from '../CustomButton';

describe('CustomButton', () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    mockOnPress.mockClear();
  });

  it('renders correctly with title', () => {
    const { getByText } = render(
      <CustomButton title="Test Button" onPress={mockOnPress} />
    );
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const { getByTestId } = render(
      <CustomButton title="Test Button" onPress={mockOnPress} testID="custom-button" />
    );
    fireEvent.press(getByTestId('custom-button'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('shows loading indicator when loading is true', () => {
    const { queryByText, UNSAFE_getByType } = render(
      <CustomButton title="Test Button" onPress={mockOnPress} loading={true} />
    );
    expect(queryByText('Test Button')).toBeNull();
  });

  it('is disabled when disabled prop is true', () => {
    const { getByTestId } = render(
      <CustomButton 
        title="Test Button" 
        onPress={mockOnPress} 
        disabled={true}
        testID="custom-button"
      />
    );
    const button = getByTestId('custom-button');
    expect(button.props.accessibilityState.disabled).toBe(true);
  });

  it('matches snapshot', () => {
    const tree = render(
      <CustomButton title="Test Button" onPress={mockOnPress} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
