import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider, MD3DarkTheme } from 'react-native-paper';
import { AuthProvider } from './src/context/AuthContext';
import { ProjectProvider } from './src/context/ProjectContext';
import AppNavigator from './src/navigation/AppNavigator';
import { COLORS } from './src/constants/theme';

const theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: COLORS.primary,
    secondary: COLORS.secondary,
    background: COLORS.background,
    surface: COLORS.surface,
    error: COLORS.error,
  },
};

export default function App() {
  return (
    <AuthProvider>
      <ProjectProvider>
        <PaperProvider theme={theme}>
          <StatusBar style="light" />
          <AppNavigator />
        </PaperProvider>
      </ProjectProvider>
    </AuthProvider>
  );
}
