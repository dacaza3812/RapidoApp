import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CustomAlert, { CustomModalAlert } from '../CustomAlert';

describe('CustomAlert (ReusableModal)', () => {
  const mockOnLeftPress = jest.fn();
  const mockOnRightPress = jest.fn();

  beforeEach(() => {
    mockOnLeftPress.mockClear();
    mockOnRightPress.mockClear();
  });

  it('renders correctly when visible', () => {
    const { getByText } = render(
      <CustomAlert
        visible={true}
        mainText="Main Title"
        descriptionText="Description"
        leftButtonText="Cancel"
        rightButtonText="Confirm"
        onLeftButtonPress={mockOnLeftPress}
        onRightButtonPress={mockOnRightPress}
      />
    );
    expect(getByText('Main Title')).toBeTruthy();
    expect(getByText('Description')).toBeTruthy();
    expect(getByText('Cancel')).toBeTruthy();
    expect(getByText('Confirm')).toBeTruthy();
  });

  it('calls onLeftButtonPress when left button is pressed', () => {
    const { getByText } = render(
      <CustomAlert
        visible={true}
        mainText="Main Title"
        descriptionText="Description"
        leftButtonText="Cancel"
        rightButtonText="Confirm"
        onLeftButtonPress={mockOnLeftPress}
        onRightButtonPress={mockOnRightPress}
      />
    );
    fireEvent.press(getByText('Cancel'));
    expect(mockOnLeftPress).toHaveBeenCalledTimes(1);
  });

  it('calls onRightButtonPress when right button is pressed', () => {
    const { getByText } = render(
      <CustomAlert
        visible={true}
        mainText="Main Title"
        descriptionText="Description"
        leftButtonText="Cancel"
        rightButtonText="Confirm"
        onLeftButtonPress={mockOnLeftPress}
        onRightButtonPress={mockOnRightPress}
      />
    );
    fireEvent.press(getByText('Confirm'));
    expect(mockOnRightPress).toHaveBeenCalledTimes(1);
  });

  it('matches snapshot', () => {
    const tree = render(
      <CustomAlert
        visible={true}
        mainText="Main Title"
        descriptionText="Description"
        leftButtonText="Cancel"
        rightButtonText="Confirm"
        onLeftButtonPress={mockOnLeftPress}
        onRightButtonPress={mockOnRightPress}
      />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('CustomModalAlert', () => {
  const mockOnCenterPress = jest.fn();

  beforeEach(() => {
    mockOnCenterPress.mockClear();
  });

  it('renders correctly when visible', () => {
    const { getByText } = render(
      <CustomModalAlert
        visible={true}
        mainText="Alert Title"
        descriptionText="Alert Description"
        centerText="OK"
        onCenterButtonPress={mockOnCenterPress}
      />
    );
    expect(getByText('Alert Title')).toBeTruthy();
    expect(getByText('Alert Description')).toBeTruthy();
    expect(getByText('OK')).toBeTruthy();
  });

  it('calls onCenterButtonPress when center button is pressed', () => {
    const { getByText } = render(
      <CustomModalAlert
        visible={true}
        mainText="Alert Title"
        descriptionText="Alert Description"
        centerText="OK"
        onCenterButtonPress={mockOnCenterPress}
      />
    );
    fireEvent.press(getByText('OK'));
    expect(mockOnCenterPress).toHaveBeenCalledTimes(1);
  });
});
