import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Navbar = () => {
  return (
    <View style={styles.navbar}>
      <View style={styles.brandContainer}>
        <Text style={styles.brand}>Smart Scanner</Text>
      </View>
      <View style={styles.linksContainer}>
        <TouchableOpacity style={styles.link}>
          <Text>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.link}>
          <Text>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.link}>
          <Text>Detail</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.link}>
          <Text>Progress</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.link}>
          <Text>Form</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logoutLink}>
          <Text>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  brandContainer: {
    flex: 1,
  },
  brand: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  linksContainer: {
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  link: {
    paddingHorizontal: 8,
  },
  logoutContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  logoutLink: {
    paddingHorizontal: 8,
  },
});

export default Navbar;
