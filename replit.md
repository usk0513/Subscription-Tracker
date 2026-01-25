# Subscription Manager (サブスク管理)

## Overview

A personal finance mobile application built with React Native and Expo that helps users track and manage their recurring subscription costs. The app prevents "subscription creep" by providing a clear overview of monthly spending with an editorial/magazine aesthetic. Japanese is the primary language for the UI.

Key features:
- Track subscriptions with price, billing cycle, and category
- View monthly total spending prominently
- Filter subscriptions by category
- Add, edit, and delete subscriptions
- Dark/light theme support

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React Native with Expo SDK 54
- Uses the new architecture (`newArchEnabled: true`)
- React 19.1 with the experimental React Compiler enabled

**Navigation**: React Navigation v7
- Native stack navigator for screen transitions
- Bottom tab navigator with blur effect for iOS
- Modal presentation for add/edit screens

**State Management**: 
- TanStack React Query for server state and caching
- Local storage via AsyncStorage for subscription data persistence
- React hooks for component-level state

**Styling Approach**:
- StyleSheet API with a centralized theme system (`client/constants/theme.ts`)
- Light/dark mode support using system preferences
- Reanimated for fluid animations
- Expo Linear Gradient for visual polish

**Key Design Patterns**:
- Themed components (`ThemedText`, `ThemedView`) for consistent styling
- Custom hooks for reusable logic (`useTheme`, `useSubscriptions`, `useScreenOptions`)
- Error boundary for graceful error handling

### Backend Architecture

**Server**: Express.js v5 running on Node.js
- Serves API endpoints prefixed with `/api`
- Handles CORS for Replit deployment domains
- Serves static web build in production

**Database**: PostgreSQL with Drizzle ORM
- Schema defined in `shared/schema.ts`
- Currently only has a users table (subscriptions stored client-side in AsyncStorage)
- Drizzle-zod for schema validation

**Current Data Storage**:
- Subscriptions are stored locally on-device using AsyncStorage
- This is a local-first approach; no server-side subscription storage yet

### Project Structure

```
client/           # React Native app code
  components/     # Reusable UI components
  screens/        # Screen components
  navigation/     # Navigation configuration
  hooks/          # Custom React hooks
  lib/            # Utilities and storage functions
  constants/      # Theme and configuration
  types/          # TypeScript type definitions
server/           # Express backend
  routes.ts       # API route registration
  storage.ts      # In-memory storage (demo)
shared/           # Shared code between client/server
  schema.ts       # Drizzle database schema
```

### Testing

- Jest with jest-expo preset for unit tests
- Tests located in `client/__tests__/`
- Mocks for AsyncStorage
- E2E tests: Playwright-based tests covering all core user flows
- Custom ConfirmModal component used instead of Alert.alert for web compatibility

## External Dependencies

### Core Services
- **PostgreSQL**: Database (configured via `DATABASE_URL` environment variable)
- **Replit Environment**: Uses `REPLIT_DEV_DOMAIN` and `REPLIT_DOMAINS` for CORS and API URLs

### Key NPM Packages
- **expo** (v54): React Native development platform
- **drizzle-orm** + **drizzle-kit**: Database ORM and migrations
- **@tanstack/react-query**: Async state management
- **react-native-reanimated**: Smooth animations
- **expo-haptics**: Touch feedback
- **@react-native-async-storage/async-storage**: Local data persistence

### Development Tools
- **TypeScript**: Type safety with strict mode
- **ESLint** + **Prettier**: Code quality and formatting
- **esbuild**: Server bundling for production