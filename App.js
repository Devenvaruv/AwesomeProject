import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import axios from 'axios';

const { width, height } = Dimensions.get('window');
const squareSize = Math.min(width, height);

export default function App() {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [showCamera, setShowCamera] = useState(false);
  const [location, setLocation] = useState(null);
  const [page2, setPage2] = useState(false);
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
  }, []);

  const takePicture = async () => {
    if (camera && location) {
      const options = { quality: 0.5 };
      const data = await camera.takePictureAsync(options);
  
      console.log(data);
      console.log(location.coords.latitude);
      console.log(location.coords.longitude);
  
      const uri = data.uri;
  
      const body = new FormData();
      body.append('image', {
        uri,
        name: 'image.jpg',
        type: 'image/jpeg'
      });
  
      body.append("latitude", location.coords.latitude);
      body.append("longitude", location.coords.longitude);
  
      
  
      axios.post('http://10.50.72.44:5000/ocr', body, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(response => {
        console.log(response.data);
        setResponse(response.data);
        setIsLoading(false); // Set loading state to false after receiving the response
      })
      .catch(error => {
        console.log(error);
        setIsLoading(false); // Set loading state to false in case of an error
      });
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

  if (!page2) {
    return (
      <View style={styles.container}>
        <View style={{ width: squareSize, height: squareSize * 1.2, alignSelf: 'center' }}>
          <Camera style={styles.camera} type={type} ref={ref => setCamera(ref)}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => setType(type === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back)}
              >
                <Image source={require('./assets/flip-camera.png')} style={styles.buttonImage} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  // setPage2(true);
                  // setIsLoading(true); // Set loading state to true before making the API request
                  takePicture();
                }}
              >
                <Image source={require('./assets/camera-icon.png')} style={styles.buttonImage} />
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      </View>
    );
  }else if (page2) {
    return (
      <View style={styles.container}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        ) : (
          <View style={styles.responseContainer}>
            {response ? (
              <Text style={styles.responseText}>{response}</Text>
            ) : (
              <Text style={styles.responseText}>No data available</Text>
            )}
          </View>
        )}
      </View>
    );
  }else {
    return (
      <View style={styles.mainContainer}>
        <Text>Welcome to the home page!</Text>
        <Button title="Open Camera" onPress={() => setShowCamera(true)} />
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
  responseText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#fff',
  },
  responseContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  responseText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
});