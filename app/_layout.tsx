import React from 'react';
import { Stack } from 'expo-router';
import { I18nProvider } from '../src/i18n';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <I18nProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0F172A',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 18,
          },
          contentStyle: {
            backgroundColor: '#F8FAFC',
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="result"
          options={{
            headerTitle: '',
          }}
        />
        <Stack.Screen
          name="about"
          options={{
            headerTitle: '',
          }}
        />
        <Stack.Screen
          name="debug"
          options={{
            headerTitle: 'Debug Diagnostics',
          }}
        />
        <Stack.Screen
          name="history"
          options={{
            headerTitle: 'History',
          }}
        />
      </Stack>
    </I18nProvider>
  );
}
