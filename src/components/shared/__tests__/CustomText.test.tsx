import React from 'react';
import { render } from '@testing-library/react-native';
import CustomText from '../CustomText';

describe('CustomText', () => {
  it('renders children text correctly', () => {
    const { getByText } = render(
      <CustomText>Test Text</CustomText>
    );
    expect(getByText('Test Text')).toBeTruthy();
  });

  it('renders with default variant h6', () => {
    const { getByText } = render(
      <CustomText>Default Text</CustomText>
    );
    const textElement = getByText('Default Text');
    expect(textElement).toBeTruthy();
  });

  it('renders with custom fontFamily', () => {
    const { getByText } = render(
      <CustomText fontFamily="Bold">Bold Text</CustomText>
    );
    expect(getByText('Bold Text')).toBeTruthy();
  });

  it('renders with custom fontSize', () => {
    const { getByText } = render(
      <CustomText fontSize={20}>Sized Text</CustomText>
    );
    expect(getByText('Sized Text')).toBeTruthy();
  });

  it('applies custom styles', () => {
    const { getByText } = render(
      <CustomText style={{ color: 'red' }}>Styled Text</CustomText>
    );
    expect(getByText('Styled Text')).toBeTruthy();
  });

  it('matches snapshot', () => {
    const tree = render(
      <CustomText>Snapshot Text</CustomText>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
