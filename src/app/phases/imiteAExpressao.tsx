import { Camera, CameraType } from 'expo-camera';
import { useRef, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image, Dimensions, Modal } from 'react-native';
import ButtonGame from '../components/ButtonGame';

import { Entypo } from '@expo/vector-icons';
import axios from 'axios';
import colors from '../config/colors';
import Title from '../components/title';
import SpeechText from '../components/SpeechText';
import { StatusBar } from 'expo-status-bar';


const { width, height } = Dimensions.get('window');

export default function ImiteAExpressao() {
  const [type, setType] = useState(CameraType.front);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [image, setImage] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const cameraRef = useRef(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    //retorna se não tiver permissao
    return (
      <View style={styles.container}>
        <Title title='Permissão' />
        <SpeechText style={{}} text={'Você precissa concerder permissão para poder jogar essa fase'} />
        <View style={styles.game}>
          <View style={{flexDirection: 'column'}}>
            <Text style={{ textAlign: 'center', marginBottom: 20, fontSize: 24, color: 'grey' }}>Por favor, conceda permissão para poder jogar essa fase</Text>
            <ButtonGame 
              style={{width: '100%', backgroundColor: 'white', borderRadius: 0, height: 50, borderWidth: 1}} 
              text='Concerder Permissão' 
              onPress={requestPermission}
            />
          </View>

        </View>
      </View>
    );
  }

  const analyzeImage = async () => {
    try {
      if (!imageBase64) {
        alert('Por favor, selecione a imagem primeiro');
        return;
      }

      // carrrengado api
      const apiKey = 'AIzaSyCkMA9XocCebpM5JsG5-EHXesCK9FkvV8w';
      const apiURL = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`

      const requestData = {
        "requests": [
          {
            "image": {
              "content": imageBase64
            },
            "features": [
              {
                "type": "FACE_DETECTION",
                "maxResults": 7
              }
            ]
          }
        ]
      }

      const apiResponse = await axios.post(apiURL, requestData);
      console.log(apiResponse.data.responses[0].faceAnnotations)
    } catch (error) {
      console.error('Erro ao enviar imagem: ', error);
      alert('Erro ao enviar imagem, tente novamente')
    }
  }

  const takePicture = async () => {
    console.log('teste')
    if (cameraRef) {
      try {
        let option = {
          quality: 1,
          base64: true,
          exif: false
        }

        const data = await cameraRef.current.takePictureAsync(option);

        if (data) {
          setImage(data.uri)
          setImageBase64(data.base64)
          console.log(data.base64)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  return (
    <View style={styles.container}>
        <Title title='Imite a expressão' />
        <SpeechText style={{}} text={'Você deve tirar uma foto imitando a expressão'} />
        <Modal
          visible={!image}
        >
        <Camera
            style={styles.camera}
            type={type}
            ref={cameraRef}
          >
            <TouchableOpacity onPress={takePicture} style={{ position: 'absolute', bottom: 10 }}>
              <Entypo name="camera" size={40} color="black" />
            </TouchableOpacity>
          </Camera>
          <StatusBar hidden/>

        </Modal>

       {image && <Image style={styles.picImage} source={{ uri: image }} />}
      <View>
        <TouchableOpacity onPress={image ? () => setImage(null) : takePicture} style={{ marginVertical: 30 }}>
          {image ?
            <Entypo name="circle-with-cross" size={40} color="black" />
            :
            <Entypo name="camera" size={40} color="black" />}
        </TouchableOpacity>

        <Button title='enviar imagem' onPress={analyzeImage} />
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
    justifyContent: 'center',
  },
  camera: {
    width,
    height,
    aspectRatio: 1728 / 2304,
    borderRadius: 60,
    position: 'absolute',
    top: 0,
    alignItems: 'center',
  },
  picImage: {
    width: 300,
    aspectRatio: 1728 / 2304,
    borderRadius: 60,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
