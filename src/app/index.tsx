import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ScrollView, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importe o AsyncStorage
import { Link, router } from 'expo-router';
import colors from './config/colors';

const { width, height } = Dimensions.get('window');


export default function Home() {


  return (
    <View style={styles.container}>
        <StatusBar backgroundColor={colors.backGroundApp}/>
        <View style={styles.game}>
          <View style={{width: width/2, height: width/2, elevation: 5}}>
            <Image style={{width: '100%', height: '100%', borderRadius: 20}} source={require('./../../assets/icon.png')}/>

          </View>

          <Link href={'/selectProfile'} asChild>
            <TouchableOpacity style={styles.buttonConfig}>
                    <Text style={{color: 'purple'}}>Jogar</Text>
            </TouchableOpacity>
          </Link>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backGroundApp,
    alignItems: 'center',
  },

  game: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  backgroundStyle: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'cover',
  },
 

  avatarButton: {
    justifyContent: 'center',
    backgroundColor: 'white',
    alignItems: 'center',
    width: 120,
    height: 120,
    borderRadius: 20,
    marginBottom: 5,
    elevation: 5,
  },
  avatarSelectionImage: {
    width: 80,
    height: 80,
    margin: 5,
  },

  buttonConfig:{
    marginTop: 20,
    justifyContent: 'center',
    backgroundColor: 'white',
    alignItems: 'center',
    width: 180,
    height: 40,
    borderRadius: 50,
    marginBottom: 5,
    elevation: 5,
  }
});
