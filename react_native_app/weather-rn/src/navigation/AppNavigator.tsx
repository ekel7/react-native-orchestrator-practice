import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CurrentWeatherScreen from '../screens/CurrentWeatherScreen';
import ForecastScreen from '../screens/ForecastScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#7A74F4',
        }}
      >
        <Tab.Screen
          name="Today"
          component={CurrentWeatherScreen}
          options={{
            tabBarIcon: ({ color, size }: { color: string; size: number }) => (
              <Text style={{ fontSize: size }}>☀️</Text>
            ),
          }}
        />
        <Tab.Screen
          name="Forecast"
          component={ForecastScreen}
          options={{
            tabBarIcon: ({ color, size }: { color: string; size: number }) => (
              <Text style={{ fontSize: size }}>📅</Text>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
