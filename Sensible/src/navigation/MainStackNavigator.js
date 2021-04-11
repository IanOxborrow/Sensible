import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen'
import NewRecordingScreen from '../screens/NewRecordingScreen'
import RecordingScreen from '../screens/RecordingScreen'

const Stack = createStackNavigator();

function MainStackNavigator() {
  return (
    <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen
                name='HomeScreen'
                component={HomeScreen}
            />

            <Stack.Screen 
                name='NewRecordingScreen' 
                component={NewRecordingScreen} 
            />

            <Stack.Screen 
                name='RecordingScreen'
                component={RecordingScreen}
            />
            
        </Stack.Navigator>
    </NavigationContainer>
  )
}

export default MainStackNavigator