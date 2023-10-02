import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importe o AsyncStorage
import { Link, router } from 'expo-router';
import expressionImages from './phases/expressionImages';
import Title from './components/title';
import { PersonData } from './components/types';
import SpeechText from './components/speechText';
import ButtonGame from './components/ButtonGame';


export default function Home() {
  const [data, setData] = useState<PersonData[]>([]);


  const loadProfileData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('@grimcoach:profile');

      if (storedData){
        const parsedData = JSON.parse(storedData);
        if (parsedData){
          console.log(parsedData);
          setData(parsedData);
        } else {
          router.replace('/createProfile')
        }
      } else {
        router.replace('/createProfile')
      }
    } catch (error) {
      console.error('Erro ao carregar dados do perfil:', error);
    }
  };
  
  useEffect(() => {
    console.log('teste');
    loadProfileData();
  }, []); // Executa somente uma vez na montagem


  const login = async (id: string) => {
    const user = {
      hash: id,
    }
    try {
      await AsyncStorage.setItem('@grimcoach:token', JSON.stringify(user)).then((e) => {
        console.log('User Logado');
        router.replace('/selectLevel')
      })
    } catch (error) {
      console.log('Erro ao inserir User')
    }
  }


  return (
    <View style={styles.container}>
        <View style={{flexDirection: 'row', paddingTop: 30}}>
          <SpeechText style={{}} text={'Selecione um perfil ou crie um'}/>
          <Title title='Selecione um Perfil'/>
        </View>
        <View style={styles.game}>

        <FlatList
            data={data}
            style={{ maxHeight: 440 }}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator= {false}
            renderItem={({ item }) => (
              <View>
                <TouchableOpacity style={styles.avatarButton} onPress={() => login(item.id)}>
                  <Image source={expressionImages.avatar[item.avatar]} style={styles.avatarSelectionImage} />
                </TouchableOpacity>
                <Text style={{ fontSize: 18, color: 'gray', textAlign: 'center', marginBottom: 20 }}>
                  {item.name}
                </Text>
              </View>
            )}
          />
          <Link href={'/createProfile'} asChild>
            <TouchableOpacity style={styles.buttonConfig}>
                    <Text style={{color: 'purple'}}>Adicionar Perfil</Text>
            </TouchableOpacity>
          </Link>
          <ButtonGame onPress={()=>{console.log('teste')}} text='olae' style={{backgroundColor: 'blue'}}/>
        </View>
      <StatusBar hidden />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C8EBFF',
    alignItems: 'center',
  },

  game: {
    flex: 1,
    paddingTop: 40,
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
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 5,
    elevation: 5,
  },
  avatarSelectionImage: {
    width: 50,
    height: 50,
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
  },

  teste: {
    backgroundColor: 'red',
  }
});
