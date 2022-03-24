import React from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Image } from 'react-native';
import { Text, HStack, Heading, Box } from 'native-base';


const Loading = () => {
  return (
    <SafeAreaView style={styles.container}>
        <HStack space={2} alignItems="center">
            <ActivityIndicator />
            <Heading fontSize="md">
                Reading the notice
            </Heading>
        </HStack>
        <Image source={require('../assets/images/rocket.png')} style={styles.imageStyle}/>
        <Box width="80%" bg="rgba(0,0,0,0.5)" p="4" shadow={2} style={{ borderRadius: 12 }}>
            <Text color="white" fontWeight="700">💡 Tip</Text>
            <Text color="white">You can save the results and check them on the search screen!</Text>
        </Box>
    </SafeAreaView>
  );
};

export default Loading;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageStyle: {
        width: 320,
        height: 320,
        marginVertical: 40
    }
});
