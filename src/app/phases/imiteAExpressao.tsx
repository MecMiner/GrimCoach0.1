import { Camera, CameraType } from 'expo-camera';
import { useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, Dimensions, Modal } from 'react-native';
import ButtonGame from '../components/ButtonGame';

import { Entypo } from '@expo/vector-icons';
import axios from 'axios';
import colors from '../config/colors';
import Title from '../components/title';
import SpeechText from '../components/SpeechText';
import { StatusBar } from 'expo-status-bar';

interface Respost {
  angerLikelihood: string | null,
  joyLikelihood: string | null,
  surpriseLikelihood: string | null,
  sorrowLikelihood: string | null,
}


const { width, height } = Dimensions.get('window');

export default function ImiteAExpressao() {
  const [permission, requestPermission] = Camera.useCameraPermissions(); //Const permissao para uso da camera
  const [image, setImage] = useState(null); //Const para setar caminho da imagem
  const [imageBase64, setImageBase64] = useState(null); //Const para setar imagem 64 bits
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

  //Funão para verificar os resultados recebidos da API.
  const analyzeResult = (respost: Respost) => {
   
    if (respost) {
      // Verifica se alguma propriedade tem valor "VERY_LIKELY"
      if (respost.angerLikelihood === "VERY_LIKELY") {
        return "raiva";
      }
      if (respost.joyLikelihood === "VERY_LIKELY") {
        return "feliz";
      }
      if (respost.surpriseLikelihood === "VERY_LIKELY") {
        return "surpreso";
      }
      if (respost.sorrowLikelihood === "VERY_LIKELY") {
        return "triste";
      }

      // Verifica se alguma propriedade tem valor "LIKELY"
      if (respost.angerLikelihood === "LIKELY") {
        return "raiva";
      }
      if (respost.joyLikelihood === "LIKELY") {
        return "feliz";
      }
      if (respost.surpriseLikelihood === "LIKELY") {
        return "surpreso";
      }
      if (respost.sorrowLikelihood === "LIKELY") {
        return "triste";
      }

      // Verifica se alguma propriedade tem valor 'PROBABLE", sozinho.
      if (respost.angerLikelihood === "PROBABLE" &&
        respost.joyLikelihood != "PROBABLE" &&
        respost.surpriseLikelihood != "PROBABLE" &&
        respost.sorrowLikelihood != "PROBABLE") {

        return "raiva";
      }
      if (respost.joyLikelihood === "PROBABLE" &&
        respost.angerLikelihood != "PROBABLE" &&
        respost.surpriseLikelihood != "PROBABLE" &&
        respost.sorrowLikelihood != "PROBABLE") {
        return "feliz";
      }
      if (respost.surpriseLikelihood === "PROBABLE" &&
        respost.joyLikelihood != "PROBABLE" &&
        respost.angerLikelihood != "PROBABLE" &&
        respost.sorrowLikelihood != "PROBABLE") {
        return "surpreso";
      }
      if (respost.sorrowLikelihood === "PROBABLE" &&
        respost.joyLikelihood != "PROBABLE" &&
        respost.surpriseLikelihood != "PROBABLE" &&
        respost.angerLikelihood != "PROBABLE") {
        return "triste";
      }
      return null
    }

    // Se nenhum dos casos anteriores for verdadeiro, retorna null
    return null;

  }

  //Função de enviar imagem para análise
  const analyzeImage = async () => {
    try {
      if (!imageBase64) {
        alert('Por favor, selecione a imagem primeiro');
        return;
      }

      setAnalyzing(true);

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
                "maxResults": 1
              }
            ]
          }
        ]
      }

      const apiResponse = await axios.post(apiURL, requestData);
      const parsedData = (apiResponse.data.responses[0].faceAnnotations);
      if (parsedData) {
        const result: Respost = parsedData[0];
        console.log(result);
        setRespost(analyzeResult(result));
      }

    } catch (error) {
      console.error('Erro ao enviar imagem: ', error);
      alert('Erro ao enviar imagem, tente novamente')
    } finally {
      setAnalyzing(false);
    }
  }


  //Capura imagem
  const takePicture = async () => {

    if (cameraRef && cameraRef.current) {
      try {
        //opções de configuração da imagem
        let option = {
          quality: 1,
          base64: true,
          exif: false
        }

        const data = await cameraRef.current.takePictureAsync(option);

        if (data) {
          setOpenCamera(false);
          setImage(data.uri)
          setImageBase64(data.base64)
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
        visible={openCamera}
      >
        <Camera
          style={styles.camera}
          type={CameraType.front}
          ref={cameraRef}
        >
          <TouchableOpacity onPress={takePicture} style={{ position: 'absolute', bottom: 50 }}>
            <Entypo name="circle" size={70} color="black" />
          </TouchableOpacity>
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
        <View>
          <View style={{ flexDirection: 'row', marginTop: 20 }}>
            <ButtonGame disabled={!image} style={styles.button} onPress={() => setImage(null)} text='Refazer' />
            <ButtonGame disabled={!image} style={styles.button} onPress={analyzeImage} text={!analyzing ? 'Verificar' : 'Analizando'} />

          </View>
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
    position: 'absolute',
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
