import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import NewRecordingScreen from '../screens/NewRecordingScreen';
//import InvoiceScreen from '../screens/HomeScreen';
//import ProjectScreen from '../screens/RecordingScreen';

const Stack = createStackNavigator();

function MainStackNavigator() {
  return (
    <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen 
                name='NewRecordingScreen' 
                component={NewRecordingScreen} 
            />

            {/*
            <Stack.Screen
                name='HomeScreen'
                component={HomeScreen}
            />

            <Stack.Screen 
                name='RecordingScreen'
                component={RecordingScreen}
            />*/}
            
        </Stack.Navigator>
    </NavigationContainer>
  )
}

export default MainStackNavigator