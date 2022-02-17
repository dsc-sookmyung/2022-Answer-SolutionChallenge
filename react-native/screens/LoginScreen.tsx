import React, { useState } from 'react';
import { StyleSheet, Text, SafeAreaView, View, Alert, Image } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { theme } from '../core/theme';
import type { Navigation } from '../types';
  
export default function LoginScreen({ navigation }: Navigation) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Login Screen</Text>
        </View>   
    );
}