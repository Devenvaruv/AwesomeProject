import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useNavigation } from '@react-navigation/native';
import DisplayPage from './DisplayPage';

// Get window dimensions
const { width, height } = Dimensions.get('window');
const squareSize = Math.min(width, height);

export default function MainPage() {
  // State variables
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [showCamera, setShowCamera] = useState(false);
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // New state for loading after POST request
  const navigation = useNavigation();

  // Effect hook for initializing camera and location permissions
  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');

      const locationStatus = await Location.requestForegroundPermissionsAsync();
      setHasLocationPermission(locationStatus.status === 'granted');

      if (locationStatus.status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation(loc);
      }
    })();
    // Set showCamera to true after component mounts
    setShowCamera(true);
  }, []);

  // Function to handle taking picture and making POST request
  const takePicture = async () => {
    if (camera && location) {
      setIsLoading(true); // Set loading state to true before making the POST request
      const options = { quality: 0.5 };
      const data = await camera.takePictureAsync(options);

      const uri = data.uri;

      const body = new FormData();
      body.append('image', {
        uri, 
        name: 'image.jpg',
        type: 'image/jpeg'
      });
      body.append('latitude', location.coords.latitude);
      body.append('longitude', location.coords.longitude);

      axios.post('http://10.50.72.44:5000/ocr', body, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(response => {
        console.log(response);
        setIsLoading(false); // Set loading state to false after receiving the response
        navigation.navigate('DisplayPage', { data: response.data }); // Navigate to DisplayPage
      })
      .catch(error => {
        setIsLoading(false); // Set loading state to false if there's an error
        console.log(error);
      });
    }
  };

  // Render loading indicator while loading
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Render camera or home page based on showCamera state
  if (showCamera) {
    return (
      <View style={styles.container}>
        <Navbar/>
        <View style={{ width: squareSize, height: squareSize * 1.2, alignSelf: 'center' }}>
          <Camera style={styles.camera} type={type} ref={ref => setCamera(ref)}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={() => setType(type === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back)}>
                <Image source={require('../assets/flip-camera.png')} style={styles.buttonImage} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={takePicture}>
                <Image source={require('../assets/camera-icon.png')} style={styles.buttonImage} />
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      </View>
    );
  } else {
    return (
      <View style={styles.mainContainer}>
        <Text>Welcome to the home page!</Text>
      </View>
    );
  }
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  button: {
    padding: 10,
    borderRadius: 30,
    backgroundColor: '#fff',
  },
  buttonImage: {
    width: 40,
    height: 40,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
