import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';

import WelcomeScreen from '../screens/WelcomeScreen';
import HomeScreen from '../screens/HomeScreen';
import AddTask from '../screens/AddTask';
import TaskDetails from '../screens/TaskDetails';
import {_retrieveData} from '../utils/AsyncStorageHelper';
import Tasks from '../screens/Tasks';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    border: 'transparent',
  },
};

const Stack = createNativeStackNavigator();

const MainNavigation = () => {
  const [name, setName] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getName = async () => {
      try {
        // Retrieve name from AsyncStorage
        const retrievedName = await _retrieveData('name');
        setName(retrievedName);
      } catch (error) {
        console.error('Error retrieving name:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getName();
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName={name ? 'HomeScreen' : 'Welcome'}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="AddTask" component={AddTask} />
        <Stack.Screen name="TaskDetails" component={TaskDetails} />
        <Stack.Screen name="Tasks" component={Tasks} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigation;
