{/*import React, { useState, useEffect } from 'react';
import { View, Image, Text, StyleSheet, Pressable } from 'react-native';
import expressionImages from './expressionImages';
import expressionName from './expressionName';
import SuccessModal from '../modal/sucess';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import { MaterialIcons } from '@expo/vector-icons';

export default function Phase2() {
  const [expression, setExpression] = useState<string>('alegre');
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [audioRecording, setAudioRecording] = useState<Audio.Recording | null>(null);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    Audio.requestPermissionsAsync()
    .then(({granted}) => {
        if (granted) {
            console.log('Tenho permissao para usar o MIC? ' , granted);
            Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                interruptionModeIOS: InterruptionModeIOS.DoNotMix,
                playsInSilentModeIOS: true,
                shouldDuckAndroid: true,
                interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
                playThroughEarpieceAndroid: true
            })
        }
    })
    // Escolhe aleatoriamente uma emoção
    const randomEmotion = expressionName[Math.floor(Math.random() * expressionName.length)];
    setExpression(randomEmotion.toLowerCase());
  }, []);

  const startRecording = async () => {
    try {
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await recording.startAsync();
      setAudioRecording(recording);
      setIsRecording(true);
    } catch (error) {
      console.error('Erro ao iniciar a gravação de áudio:', error);
    }
  };

  const stopRecording = async () => {
    if (audioRecording) {
      try {
        await audioRecording.stopAndUnloadAsync();
        setAudioUri(audioRecording.getURI());
        setIsRecording(false);
      } catch (error) {
        console.error('Erro ao parar a gravação de áudio:', error);
      }
    }
  };

  const playAudio = async () => {
    if (audioUri) {
      const soundObject = new Audio.Sound();
      try {
        await soundObject.loadAsync({ uri: audioUri });
        await soundObject.playAsync();
      } catch (error) {
        console.error('Erro ao reproduzir áudio:', error);
      }
    }
  };

  const checkEmotion = () => {
    console.log(audioRecording?.getURI())
    
    setIsSuccessModalVisible(true);
  };

  const closeSuccessModal = () => {
    setIsSuccessModalVisible(false);
  };

  return (
    <View style={styles.container}>

      {expressionImages.facil[expression] && (
        <Image
          source={expressionImages.facil[expression]}
          style={styles.image}
        />
      )}


      <Pressable
        onPressIn={startRecording}
        onPressOut={stopRecording}
        style={({ pressed }) => [
          styles.recordButton,
          {
            backgroundColor: pressed ? 'black' : '#B3B3B3', // Altere as cores conforme desejar
          },
        ]}
      >
        <MaterialIcons
          name='mic'
          size={44}
          color="#212121"
        />
      </Pressable>


      <Pressable onPress={playAudio} disabled={!audioUri}>
        <MaterialIcons name="play-arrow" size={48} color="blue" />
      </Pressable>

      <Pressable onPress={checkEmotion}>
        <Text>Verificar Emoção</Text>
      </Pressable>


      <SuccessModal isVisible={isSuccessModalVisible} onClose={closeSuccessModal} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  recordButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
});
*/}