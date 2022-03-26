import React from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Image } from 'react-native';
import { Text, HStack, Heading, Box } from 'native-base';
import i18n from 'i18n-js';
import '../locales/i18n';


const Loading = () => {
  return (
    <SafeAreaView style={styles.container}>
        <HStack space={2} alignItems="center">
            <ActivityIndicator />
            <Heading fontSize="md">
                {i18n.t('translateLoadingDesc')}
            </Heading>
        </HStack>
        <Image source={require('../assets/images/rocket.png')} style={styles.imageStyle}/>
        <Box width={320} bg="rgba(0,0,0,0.5)" p="4" shadow={2} style={{ borderRadius: 12 }}>
            <Text color="white" fontWeight="700">💡 {i18n.t('tip')}</Text>
            <Text color="white">{i18n.t('tip_1')}</Text>
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
