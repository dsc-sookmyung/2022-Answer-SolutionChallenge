import * as React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import type { Navigation } from '../types';

export default function JoinScreen({ navigation }: Navigation) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Join Screen</Text>
        </View>   
    );
}
