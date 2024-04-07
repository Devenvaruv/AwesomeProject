import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Dimensions } from 'react-native';
import { Camera } from 'expo-camera';
import axios from 'axios';


const { width, height } = Dimensions.get('window');
const squareSize = Math.min(width, height);

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [showCamera, setShowCamera] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (camera) {
      const options = { quality: 0.5 }; // Removed base64: true
      const data = await camera.takePictureAsync(options);
  
      console.log(data.uri);
  
      const response = await fetch(data.uri);
      const blob = await response.blob(); // Convert the image to a blob
  
      const body = new FormData();
      body.append('image', blob, 'photo.jpg'); // Append the blob to FormData with a filename
      body.append('location', JSON.stringify({ latitude: '0', longitude: '0' }));
  
      axios.post('http://127.0.0.1:5000/ocr', body, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(response => console.log(response.data))
      .catch(error => console.log(error));
    }
  };
  
  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  if (showCamera) {
    return (
      <View style={styles.container}>
        <View style={{ width: squareSize, height: squareSize * 1.2, alignSelf: 'center' }}>
          <Camera style={styles.camera} type={type} ref={(ref) => setCamera(ref)}>
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
        <Button title="Open Camera" onPress={() => setShowCamera(true)} />
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
  
  gridContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around', 
  },
  gridItem: {
    width: '45%', 
    aspectRatio: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    margin: '2.5%', 
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

