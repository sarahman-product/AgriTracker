import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import LoginScreen from './modules/auth/screens/LoginScreen';
import HomeScreen from './modules/program/screens/HomeScreen';
import FarmersListScreen from './modules/farmer/screens/FarmersListScreen';
import FarmerDetailScreen from './modules/farmer/screens/FarmerDetailScreen';
import AddFarmerScreen from './modules/farmer/screens/AddFarmerScreen';
import FarmDetailScreen from './modules/farm/screens/FarmDetailScreen';
import AddFarmScreen from './modules/farm/screens/AddFarmScreen';
import CropEnrollmentScreen from './modules/crop-enrollment/screens/CropEnrollmentScreen';
import SurveysListScreen from './modules/survey-engine/screens/SurveysListScreen';
import SurveyFormScreen from './modules/survey-engine/screens/SurveyFormScreen';
import DashboardScreen from './modules/dashboard/screens/DashboardScreen';

import { AuthProvider, useAuth } from './shared/context/AuthContext';
import { colors } from './shared/theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AppNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <></>;
  }

  if (!isAuthenticated) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
      </Stack.Navigator>
    );
  }

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray,
        tabBarStyle: { paddingBottom: 5, height: 60 },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ 
          tabBarLabel: 'Home',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <HomeIcon color={color} /> 
        }} 
      />
      <Tab.Screen 
        name="Farmers" 
        component={FarmersStack}
        options={{ 
          tabBarLabel: 'Farmers',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <FarmersIcon color={color} /> 
        }} 
      />
      <Tab.Screen 
        name="Surveys" 
        component={SurveysStack}
        options={{ 
          tabBarLabel: 'Surveys',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <SurveyIcon color={color} /> 
        }} 
      />
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ 
          tabBarLabel: 'Dashboard',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <DashboardIcon color={color} /> 
        }} 
      />
    </Tab.Navigator>
  );
}

function FarmersStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="FarmersList" component={FarmersListScreen} options={{ title: 'My Farmers' }} />
      <Stack.Screen name="FarmerDetail" component={FarmerDetailScreen} options={{ title: 'Farmer Details' }} />
      <Stack.Screen name="AddFarmer" component={AddFarmerScreen} options={{ title: 'Add Farmer' }} />
      <Stack.Screen name="AddFarm" component={AddFarmScreen} options={{ title: 'Add Farm' }} />
      <Stack.Screen name="CropEnrollment" component={CropEnrollmentScreen} options={{ title: 'Crop Enrollment' }} />
      <Stack.Screen name="FarmDetail" component={FarmDetailScreen} options={{ title: 'Farm Details' }} />
    </Stack.Navigator>
  );
}

function SurveysStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="SurveysList" component={SurveysListScreen} options={{ title: 'Surveys' }} />
      <Stack.Screen name="SurveyForm" component={SurveyFormScreen} options={{ title: 'Survey' }} />
    </Stack.Navigator>
  );
}

// Simple icon components
const HomeIcon = ({ color }: { color: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={color}><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
);
const FarmersIcon = ({ color }: { color: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={color}><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
);
const SurveyIcon = ({ color }: { color: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={color}><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
);
const DashboardIcon = ({ color }: { color: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={color}><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>
);

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}