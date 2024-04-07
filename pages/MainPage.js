import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Dimensions } from 'react-native';
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import axios from 'axios';
import Navbar from '../components/Navbar';

const { width, height } = Dimensions.get('window');
const squareSize = Math.min(width, height);

export default function App() {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [showCamera, setShowCamera] = useState(false);
  const [location, setLocation] = useState(null);

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

  const takePicture = async () => {
    if (camera && location) {
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
      })
      .catch(error => console.log(error));
    }
  };

  if (hasCameraPermission === null || hasLocationPermission === null) {
    return <View />;
  }
  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }
  if (hasLocationPermission === false) {
    return <Text>No access to location</Text>;
  }

  if (showCamera) {
    return (
      <View style={styles.container}>
        <Navbar/>
        <View style={{ width: squareSize, height: squareSize * 1.2, alignSelf: 'center' }}>
          <Camera style={styles.camera} type={type} ref={ref => setCamera(ref)}>
            <View style={styles.buttonContainer}>
              <Button title="Flip Camera" onPress={() => setType(type === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back)} />
              <Button title="Click " onPress={takePicture} />
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
  mainContainer: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
