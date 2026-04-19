import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from '../screens/HomeScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { Colors } from '../theme/colors';

const Stack = createStackNavigator();

export const RootNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.background,
          borderBottomWidth: 1,
          borderBottomColor: Colors.border,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: Colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        cardStyle: { backgroundColor: Colors.background },
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={({ navigation }) => ({
          title: 'TRANSLATOR',
          headerRight: () => (
            <TouchableOpacity 
              onPress={() => navigation.navigate('Settings')}
              style={{ marginRight: 16 }}
            >
              <Settings size={20} color={Colors.text} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ title: 'SETTINGS' }}
      />
    </Stack.Navigator>
  );
};

import { TouchableOpacity } from 'react-native';
import { Settings } from 'lucide-react-native';

