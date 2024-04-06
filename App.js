import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Dimensions } from 'react-native';
import { Camera } from 'expo-camera';
import * as FileSystem from 'expo-file-system';

// Determine the square size based on the screen dimensions
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
      const options = { quality: 0.5, base64: true };
      const data = await camera.takePictureAsync(options);
      const savePath = `${FileSystem.documentDirectory}${Date.now()}.jpg`;
      await FileSystem.writeAsStringAsync(savePath, data.base64, {
        encoding: FileSystem.EncodingType.Base64,
      });
      console.log('Photo saved at', savePath);
      setShowCamera(false);
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

// Example of a Flexbox grid for button container
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
  // Additional styles for hypothetical grid elements if needed
  gridContainer: {
    flex: 1,
    flexDirection: 'row', // Arrange items in rows
    flexWrap: 'wrap', // Allow items to wrap to the next line
    justifyContent: 'space-around', // Distribute space around items
  },
  gridItem: {
    width: '45%', // Approximately half the container width minus padding
    aspectRatio: 1, // Keep the item square
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    margin: '2.5%', // Provide some margin
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
