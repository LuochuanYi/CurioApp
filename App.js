import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LanguageProvider } from './contexts/LanguageContext';
import './i18n'; // Initialize i18n
import './utils/logger'; // Initialize centralized logging
import HomeScreen from './screens/HomeScreen';
import MonitorScreen from './screens/MonitorScreen';
import EngageScreen from './screens/Engagescreen';
import PersonalizeScreen from './screens/PersonlizeScreen';
import StoryDetailScreen from './screens/StoryDetailScreen';
import SongPlayerScreen from './screens/SongPlayerScreen';
import CategoryDetailScreen from './screens/CategoryDetailScreen';
import StoryCategoryScreen from './screens/StoryCategoryScreen';
import SongCategoryScreen from './screens/SongCategoryScreen';
import LearningCategoryScreen from './screens/LearningCategoryScreen';
import ActivityDetailScreen from './screens/ActivityDetailScreen';


const Stack = createNativeStackNavigator();

export default function App() {
  // console.log('App component rendering...'); // Disabled to reduce log noise
  
  return (
    <LanguageProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Home"
          screenOptions={{
            headerShown: false, // Hide default headers since we have custom ones
          }}
        >
          <Stack.Screen 
            name="Home" 
            component={HomeScreen}
          />
          <Stack.Screen 
            name="Monitor" 
            component={MonitorScreen}
          />
          <Stack.Screen 
            name="Engage" 
            component={EngageScreen}
          />
          <Stack.Screen 
            name="Personalize" 
            component={PersonalizeScreen}
          />
          <Stack.Screen 
            name="StoryDetail" 
            component={StoryDetailScreen}
          />
          <Stack.Screen 
            name="SongPlayer" 
            component={SongPlayerScreen}
            options={{
              title: 'Sign-Along Song',
              presentation: 'modal',
            }}
          />
          <Stack.Screen 
            name="CategoryDetail" 
            component={CategoryDetailScreen}
            options={{
              title: 'Learning Category',
            }}
          />
          <Stack.Screen 
            name="StoryCategoryScreen" 
            component={StoryCategoryScreen}
            options={{
              title: 'Story Category',
            }}
          />
          <Stack.Screen 
            name="SongCategoryScreen" 
            component={SongCategoryScreen}
            options={{
              title: 'Song Category',
            }}
          />
          <Stack.Screen 
            name="LearningCategoryScreen" 
            component={LearningCategoryScreen}
            options={{
              title: 'Learning Category',
            }}
          />
          <Stack.Screen 
            name="ActivityDetail" 
            component={ActivityDetailScreen}
            options={{
              title: 'Activity',
            }}
          />

        </Stack.Navigator>
      </NavigationContainer>
    </LanguageProvider>
  );
}
