/* eslint-disable no-trailing-spaces */
/* eslint-disable prettier/prettier */
import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import  Ionicons  from 'react-native-vector-icons/Ionicons';

const MusicPlayer = () => {
  return (
    <View style={style.container}> 
        <Ionicons />
        <Text>React Native Music Player</Text>
    </View>
  );
};

export default MusicPlayer; 

const style = StyleSheet.create({ 
    container: { 
        flex: 1, 
        backgroundColor: '#555', 
        alignItems: 'center', 
        justifyContent: 'center',
    },
}); 
