import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import LoginScreen from './src/Pages/SignIn';
import NewsFeed from './src/Pages/Feed';
import ProfileScreen from './src/Pages/Profile';
import InterestScreen from './src/Pages/CategorySelection';
import './global.css'


// Enable screens
enableScreens();

// Define the type for our route parameters
export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  NewsFeed: undefined;
  Profile: undefined;
  Category:undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// Placeholder components - we'll create these next
const SignupScreen: React.FC = () => null;

const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerShown: false,
            gestureEnabled: false,
          }}
        >
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
          />
          <Stack.Screen 
            name="Signup" 
            component={SignupScreen} 
          />
          <Stack.Screen 
            name="Profile" 
            component={ProfileScreen} 
          />
          <Stack.Screen 
            name="Category" 
            component={InterestScreen} 
          />
          <Stack.Screen 
            name="NewsFeed" 
            component={NewsFeed}
            options={{
              headerShown: false,
              title: 'News Feed',
              headerBackVisible: false,
            }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;