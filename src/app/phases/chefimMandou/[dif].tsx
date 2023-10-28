import { Camera, CameraType } from 'expo-camera';
import { useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, Dimensions, Modal } from 'react-native';
import ButtonGame from '../../components/ButtonGame';

import { Entypo } from '@expo/vector-icons';
import axios from 'axios';
import colors from '../../config/colors';
import Title from '../../components/title';
import SpeechText from '../../components/SpeechText';
import { StatusBar } from 'expo-status-bar';



const { width, height } = Dimensions.get('window');

export default function ImiteAExpressao() {
  const [permission, requestPermission] = Camera.useCameraPermissions(); //Const permissao para uso da camera
  const [image, setImage] = useState(null); //Const para setar caminho da imagem

  const [openCamera, setOpenCamera] = useState(false); //Estado de abertura de camera
  const [respost, setRespost] = useState<string | null>(); //Const resposta para conferir
  const [analyzing, setAnalyzing] = useState<boolean>(false); //Verificar estado da análise
  const cameraRef = useRef(null);

  if (!permission) {
    return <View />;
  }

  //Verificar se tem acesso a câmera, se não tiver, retona
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Title title='Permissão' />
        <SpeechText style={{}} text={'Você precissa concerder permissão para poder jogar essa fase'} />
        <View style={styles.game}>
          <View style={{ flexDirection: 'column' }}>
            <Text style={{ textAlign: 'center', marginBottom: 20, fontSize: 24, color: 'grey' }}>Por favor, conceda permissão para poder jogar essa fase</Text>
            <ButtonGame
              disabled={false}
              style={{ width: '100%', backgroundColor: 'white', borderRadius: 0, height: 50, borderWidth: 1 }}
              text='Concerder Permissão'
              onPress={requestPermission}
            />
          </View>
        </View>
      </View>
    );
  }

  



  return (
    <View style={styles.container}>
      <Title title='Imite a expressão' />
      <SpeechText style={{}} text={'Você deve tirar uma foto imitando a expressão'} />
      <Modal
        visible={openCamera}
      >
        <Camera
          style={styles.camera}
          type={CameraType.front}
          ref={cameraRef}
        >
        </Camera>
        <StatusBar hidden />

      </Modal>
      <View style={styles.game}>

        <View style={styles.imagePic}>
          {image ?
            <Image style={styles.picImage} source={{ uri: image }} />
            :

            <TouchableOpacity onPress={() => setOpenCamera(true)}>
              <Entypo name="camera" size={40} color="black" />
            </TouchableOpacity>}
        </View>
        <Text>{'Resultado: ' + respost}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.backGroundApp,
  },

  game: {
    flex: 1,
    alignItems: 'center',
    marginTop: 50,
  },
  camera: {
    flex: 1,
    borderRadius: 60,
    top: 0,
    alignItems: 'center',
  },
  picImage: {
    width: 300,
    aspectRatio:  1/1,
    transform: [{ scaleX: -1 }],
  },
  imagePic: {
    width: 350,
    aspectRatio: 1/1,
    borderRadius: 1,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'gray',

  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    backgroundColor: 'white',
    borderRadius: 20,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    elevation: 5,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
