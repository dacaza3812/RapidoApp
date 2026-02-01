# Testing Guide - Rapido App

## Configuración

El proyecto utiliza **Jest** con **React Native Testing Library** para testing.

### Scripts disponibles:

```bash
# Ejecutar todos los tests en modo watch
npm test

# Ejecutar tests una sola vez
npx jest --testPathPattern="CustomButton"

# Ejecutar tests con coverage
npx jest --coverage

# Ejecutar tests específicos
npx jest src/components/shared/__tests__/CustomButton.test.tsx
```

## Estructura de Tests

Los tests se encuentran en carpetas `__tests__` junto a los componentes:

```
src/
├── components/
│   └── shared/
│       ├── CustomButton.tsx
│       └── __tests__/
│           └── CustomButton.test.tsx
```

## Componentes con Tests

### 1. CustomButton (`src/components/shared/__tests__/CustomButton.test.tsx`)
- ✅ Renderizado con título
- ✅ Evento onPress
- ✅ Estado de loading
- ✅ Estado disabled
- ✅ Snapshot testing

### 2. CustomText (`src/components/shared/__tests__/CustomText.test.tsx`)
- ✅ Renderizado de texto
- ✅ Variantes de fuente
- ✅ Tamaños personalizados
- ✅ Estilos custom
- ✅ Snapshot testing

### 3. CustomAlert (`src/components/shared/__tests__/CustomAlert.test.tsx`)
- ✅ Renderizado de modal
- ✅ Botón izquierdo (onLeftButtonPress)
- ✅ Botón derecho (onRightButtonPress)
- ✅ CustomModalAlert (alerta simple)
- ✅ Snapshot testing

### 4. Role Screen (`src/app/__tests__/role.test.tsx`)
- ✅ Renderizado de pantalla
- ✅ Navegación a customer/auth
- ✅ Navegación a captain/auth
- ✅ Accesibilidad
- ✅ Snapshot testing

## Accesibilidad y TestID

Los componentes ahora incluyen:

### CustomButton
- `testID="custom-button"`
- `accessibilityRole="button"`
- `accessibilityLabel` (dinámico según título)
- `accessibilityState` (disabled, busy)

### CustomText
- `testID` (opcional)
- `accessibilityLabel` (opcional)
- `accessibilityRole="text"`
- `allowFontScaling={true}`

### CustomAlert
- `testID="reusable-modal"`
- `testID="modal-left-button"`
- `testID="modal-right-button"`
- `testID="modal-main-text"`
- `testID="modal-description"`

### Role Screen
- `testID="customer-card"`
- `testID="captain-card"`
- `accessibilityRole="button"`
- `accessibilityLabel` en cada opción

## Mocks Configurados

El archivo `jest.setup.js` incluye mocks para:

- Expo modules (font, splash-screen, status-bar, router, location)
- Firebase (analytics, app, messaging)
- React Native (maps, mmkv, gesture-handler)
- Zustand stores
- Axios
- Socket.io

## Escribir Nuevos Tests

Ejemplo básico:

```typescript
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import MiComponente from '../MiComponente';

describe('MiComponente', () => {
  it('renderiza correctamente', () => {
    const { getByText } = render(<MiComponente />);
    expect(getByText('Texto esperado')).toBeTruthy();
  });

  it('maneja eventos onPress', () => {
    const mockOnPress = jest.fn();
    const { getByTestId } = render(<MiComponente onPress={mockOnPress} />);
    fireEvent.press(getByTestId('mi-boton'));
    expect(mockOnPress).toHaveBeenCalled();
  });
});
```

## Buenas Prácticas

1. **Usar testID** en elementos interactivos para testing
2. **Incluir accessibility props** para mejorar accesibilidad y testing
3. **Limpiar mocks** en `beforeEach`
4. **Usar snapshots** para detectar cambios inesperados en UI
5. **Testear comportamiento**, no implementación

## Coverage

Para generar reporte de coverage:

```bash
npx jest --coverage --collectCoverageFrom="src/**/*.{ts,tsx}"
```

El reporte se genera en la carpeta `coverage/`.
