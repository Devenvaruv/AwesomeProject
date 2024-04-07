import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function DisplayPage(){
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Display Page</Text>
      <View style={styles.content}>
        {/* Add your content here */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  content: {
    width: '80%',
    // Add any additional styles for content here
  },
});


