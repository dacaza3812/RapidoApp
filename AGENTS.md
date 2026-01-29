# AGENTS.md

## Project Overview
Rapido App - React Native/Expo ride booking application with customer and captain modes.

## Build/Lint/Test Commands

- **Development**: `npx expo start` or `npm start`
- **Android**: `npx expo run:android` or `npm run android`
- **iOS**: `npx expo run:ios` or `npm run ios`
- **Web**: `npx expo start --web` or `npm run web`
- **Lint**: `npx expo lint` or `npm run lint` (uses eslint-config-expo)
- **Test All**: `npx jest --watchAll` or `npm test`
- **Test Single**: `npx jest <file-name>.test.tsx --watch` or `npx jest <path-to-test> --testNamePattern="test name"`
- **Type Check**: `npx tsc --noEmit` (TypeScript strict mode enabled)

## Project Structure

```
src/
├── app/                    # Expo Router pages (file-based routing)
│   ├── (tabs)/            # Tab-based navigation groups
│   ├── captain/           # Captain (driver) screens
│   ├── customer/          # Customer screens
│   ├── _layout.tsx        # Root layout with providers
│   └── index.tsx          # Entry point
├── components/
│   ├── captain/           # Captain-specific components
│   ├── customer/          # Customer-specific components
│   └── shared/            # Reusable shared components
├── service/               # API services, interceptors, WebSocket
├── store/                 # Zustand state management
├── styles/                # StyleSheet definitions
├── utils/                 # Helpers, constants, types
└── lib/                   # Library configurations
```

## Code Style Guidelines

### Imports Order
1. React and React Native imports first
2. Third-party libraries (expo, navigation, zustand, etc.)
3. Absolute imports from `@/*` (project root alias)
4. Relative imports from `./` or `../`
5. Type imports last

```tsx
import React, { FC } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { useUserStore } from '@/store/userStore'
import CustomButton from './CustomButton'
import type { UserData } from '@/utils/types'
```

### Naming Conventions
- **Components**: PascalCase (e.g., `CustomButton`, `LiveTrackingMap`)
- **Hooks**: camelCase starting with `use` (e.g., `useUserStore`, `useLocation`)
- **Files**: Match component name (e.g., `CustomButton.tsx`, `userStore.tsx`)
- **Interfaces/Types**: PascalCase with descriptive names
- **Interfaces**: Prefer `interface` over `type` for object shapes
- **Props interfaces**: Use `ComponentNameProps` pattern (e.g., `CustomButtonProps`)
- **Store types**: Use `StorageProps` suffix (e.g., `UserStorageProps`)

### Component Structure
- Use functional components with `FC<Props>` type
- Props interface defined before component
- Named exports preferred for shared components
- Default exports acceptable for page components

```tsx
interface HeroSectionProps {
  title: string
  subtitle?: string
}

const HeroSection: FC<HeroSectionProps> = ({ title, subtitle }) => {
  return (
    // JSX
  )
}

export default HeroSection
```

### Formatting
- Use single quotes for strings
- No semicolons at end of lines
- 2 or 4 space indentation (be consistent)
- Trailing commas in multi-line objects/arrays
- Max line length: 100 characters

### TypeScript Standards
- Enable `strict: true` in tsconfig.json (already configured)
- Prefer explicit types over `any`
- Use proper React types: `React.ReactNode`, `React.FC`
- Export types that are reused across files
- Use type guards for runtime checks

### State Management (Zustand)
- Use stores in `src/store/` directory
- Implement persist middleware for user data
- Name stores with `use` prefix + feature name + `Store`
- Partialize persisted state to minimize storage

```tsx
export const useUserStore = create<UserStorageProps>()(
  persist(
    (set) => ({
      user: null,
      setUser: (data) => set({ user: data }),
    }),
    {
      name: "user-store",
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
)
```

### Error Handling
- Wrap async operations in try/catch blocks
- Use React Error Boundaries for component-level errors
- Implement proper loading and error states
- Log errors appropriately (avoid exposing sensitive data)

### Styling (React Native)
- Use `StyleSheet.create()` for static styles
- Place styles at bottom of file
- Use responsive fonts with `RFValue` from react-native-responsive-fontsize
- Colors from centralized `Constants.ts` file
- Avoid inline styles for repeated patterns

```tsx
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.background
  }
})
```

### Navigation (Expo Router)
- Follow file-based routing structure
- Use `(tabs)` for tab groups, `(auth)` for auth groups
- Dynamic routes use `[param]` syntax
- Use `useRouter()` for programmatic navigation
- Stack navigation configured in `_layout.tsx`

### API Services
- Use axios with interceptors in `service/apiInterceptors.tsx`
- Handle auth tokens in interceptors
- Create service files per feature (e.g., `authService.tsx`, `rideService.tsx`)
- Use WebSocket provider for real-time features

### Environment Variables
- Use `expo-constants` for config values
- Store sensitive values in environment files (not committed)
- Access via `Constants.expoConfig.extra`

## Testing (Jest + React Test Renderer)

- **Single Test File**: `npx jest src/components/Button.test.tsx`
- **Single Test Case**: `npx jest --testNamePattern="Button renders correctly"`
- **Watch Mode**: `npx jest --watch`
- **Coverage**: `npx jest --coverage`

Test file pattern: `*.test.tsx` alongside component files

## Performance Guidelines
- Use `React.memo()` for expensive components
- Optimize lists with `FlatList` or `FlashList`
- Use `useMemo` and `useCallback` appropriately
- Avoid re-renders with proper dependency arrays
- Lazy load heavy components

## Git Workflow (if committing)
- Check `git status` and `git diff` before committing
- Follow existing commit message style
- Never commit secrets (.env, credentials.json)
- Never force push to main/master

## Dependencies
- **Core**: Expo SDK 52, React 18, React Native 0.76
- **Navigation**: Expo Router v4
- **State**: Zustand v5
- **Maps**: react-native-maps, @rnmapbox/maps
- **Storage**: react-native-mmkv
- **HTTP**: Axios
- **Real-time**: Socket.io client

## No Cursor Rules or Copilot Instructions Found
This project does not contain `.cursor/rules/` or `.github/copilot-instructions.md`.

## Important Notes
- This is a mobile app - follow React Native best practices
- Use platform-specific code when needed (`Platform.OS`)
- Test on both iOS and Android
- Handle permissions properly (location, camera, etc.)
- Respect dark mode and accessibility
- Keep bundle size minimal
