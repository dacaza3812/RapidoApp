// Jest setup file for React Native testing
import 'react-native-gesture-handler/jestSetup';

// Mock expo modules
jest.mock('expo-font', () => ({
  loadAsync: jest.fn(),
  isLoaded: jest.fn(() => true),
}));

jest.mock('expo-splash-screen', () => ({
  preventAutoHideAsync: jest.fn(),
  hideAsync: jest.fn(),
}));

jest.mock('expo-status-bar', () => ({
  StatusBar: () => null,
}));

jest.mock('expo-router', () => ({
  router: {
    navigate: jest.fn(),
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  },
  useRouter: () => ({
    navigate: jest.fn(),
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
}));

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  getCurrentPositionAsync: jest.fn(() => Promise.resolve({
    coords: {
      latitude: 37.7749,
      longitude: -122.4194,
    },
  })),
}));

jest.mock('react-native-responsive-fontsize', () => ({
  RFValue: (size) => size,
  RFPercentage: (percent) => percent,
}));

jest.mock('@react-native-firebase/analytics', () => () => ({
  logScreenView: jest.fn(),
  logEvent: jest.fn(),
}));

jest.mock('@react-native-firebase/app', () => ({
  initializeApp: jest.fn(),
  getApps: jest.fn(() => []),
}));

jest.mock('@react-native-firebase/messaging', () => () => ({
  getToken: jest.fn(() => Promise.resolve('mock-token')),
  onMessage: jest.fn(() => jest.fn()),
  setBackgroundMessageHandler: jest.fn(),
}));

jest.mock('expo-notifications', () => ({
  requestPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  setNotificationHandler: jest.fn(),
}));

// Mock react-native-maps
jest.mock('react-native-maps', () => {
  const { View } = require('react-native');
  return {
    default: View,
    Marker: View,
    Circle: View,
    Polyline: View,
    Polygon: View,
  };
});

// Mock @rnmapbox/maps
jest.mock('@rnmapbox/maps', () => {
  const { View } = require('react-native');
  return {
    default: View,
    MapView: View,
    Camera: View,
    LocationPuck: View,
    ShapeSource: View,
    SymbolLayer: View,
    Images: View,
    setAccessToken: jest.fn(),
  };
});

// Mock zustand stores
jest.mock('@/store/userStore', () => ({
  useUserStore: () => ({
    user: null,
    setUser: jest.fn(),
    location: null,
    setLocation: jest.fn(),
    outOfRange: false,
  }),
}));

jest.mock('@/store/captainStore', () => ({
  useCaptainStore: () => ({
    captain: null,
    setCaptain: jest.fn(),
  }),
}));

// Mock axios
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn() },
    },
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  })),
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

// Mock react-native-mmkv
jest.mock('react-native-mmkv', () => ({
  MMKV: jest.fn(() => ({
    getString: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
    contains: jest.fn(),
  })),
}));

// Mock socket.io-client
jest.mock('socket.io-client', () => ({
  io: jest.fn(() => ({
    on: jest.fn(),
    emit: jest.fn(),
    off: jest.fn(),
    disconnect: jest.fn(),
    connect: jest.fn(),
  })),
}));

// Silence console warnings during tests
const originalWarn = console.warn;
const originalError = console.error;

beforeAll(() => {
  console.warn = (...args) => {
    if (args[0]?.includes?.('Animated')) return;
    if (args[0]?.includes?.('expo-')) return;
    originalWarn.call(console, ...args);
  };
  
  console.error = (...args) => {
    if (args[0]?.includes?.('Warning:')) return;
    if (args[0]?.includes?.('act(')) return;
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.warn = originalWarn;
  console.error = originalError;
});

// Global test utilities
global.flushPromises = () => new Promise(resolve => setImmediate(resolve));
