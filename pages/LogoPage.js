import React from 'react';
import { StyleSheet, View, Image, Dimensions } from 'react-native';
import Navbar from '../components/Navbar';
const { height: screenHeight } = Dimensions.get('window');

export default function LogoPage() {
  return (
    <View style={styles.container}>
    <Navbar/>
      <View style={[styles.imageContainer, { height: screenHeight }]}>
        <Image source={require('../images/logo.jpeg')} style={styles.logo} resizeMode="contain" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    flex: 1, 
    width: '100%',
    height: '100%',
  },
});
