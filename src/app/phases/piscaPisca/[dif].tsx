import { Camera, CameraType, FaceDetectionResult } from 'expo-camera';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, Dimensions, Modal } from 'react-native';
import ButtonGame from '../../components/ButtonGame';

import { Entypo } from '@expo/vector-icons';
import colors from '../../config/colors';
import Title from '../../components/title';
import SpeechText from '../../components/SpeechText';
import * as FaceDetector from 'expo-face-detector';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams } from 'expo-router';
import { Dificuldade } from '../../utils/utils';

const comandos = [
    'Pisque ambos os olhos',
    'Pisque o olho direito',
    'Pisque o olho esquerdo'
  ];

const { width, height } = Dimensions.get('window');

export default function ImiteAExpressao() {
  const [permission, requestPermission] = Camera.useCameraPermissions(); //Const permissao para uso da camera
  const cameraRef = useRef(null);
  const [piscouEsquerdo, setPiscouEsquerdo] = useState(5);
  const [piscouDireito, setPiscouDireito] = useState(0);
  const [fechouOlhos, setFechouOlhos] = useState(0);
  const [olhosAberto, setOlhosAberto] = useState(false);
  const [currentComando, setCurrentComando] = useState(
    comandos[Math.floor(Math.random() * comandos.length)]   
  );
  const [dificuldade, setDificuldade] = useState<Dificuldade>('facil')
  const [sucessoNecessario, setSucessoNecessario] = useState(0);

  const { dif } = useLocalSearchParams();

  const diff = Array.isArray(dif) ? dif[0] : dif;

  useEffect(() => {
    if (diff === 'facil' || diff === 'medio' || diff === 'dificil') {
      setDificuldade(diff);
    }

    if (dificuldade === 'facil') {
        setSucessoNecessario(3);
      } else if (dificuldade === 'medio') {
        setSucessoNecessario(5);
      } else if (dificuldade === 'dificil') {
        setSucessoNecessario(7);
      }
  }, [diff]);


  useEffect(() =>{
    if (sucessoNecessario <= 0){
        console.log('correto');
        resetGame();
    }
  }, [sucessoNecessario])




  const resetGame = () => {
    setFechouOlhos(0);
    setPiscouDireito(0);
    setPiscouEsquerdo(0);
    let randomIndex = Math.floor(Math.random() * comandos.length);
    let newCommand = comandos[randomIndex];
    setCurrentComando(newCommand);
    if (dificuldade === 'facil') {
        setSucessoNecessario(3);
      } else if (dificuldade === 'medio') {
        setSucessoNecessario(5);
      } else if (dificuldade === 'dificil') {
        setSucessoNecessario(7);
      }
  }


  function handleFaceDetector({faces}: FaceDetectionResult){
    //console.log(faces);

    const face = faces[0] as any;

    if (face){
        if (currentComando == 'Pisque o olho esquerdo'){
            if(face.leftEyeOpenProbability > 0.5 && face.rightEyeOpenProbability < 0.3){
                setPiscouEsquerdo(piscouEsquerdo + 1);
            }
        }
        if (currentComando === 'Pisque o olho direito') {
            if (face.rightEyeOpenProbability > 0.5 && face.leftEyeOpenProbability < 0.3){
                setPiscouDireito(piscouDireito + 1);

            } 
        }
        
        if (currentComando === 'Pisque ambos os olhos') {
            if (face.rightEyeOpenProbability < 0.3 && face.leftEyeOpenProbability < 0.3){
                setFechouOlhos(fechouOlhos + 1);
            } 
        }


        if (face.rightEyeOpenProbability > 0.3 && face.leftEyeOpenProbability > 0.3){
            
            if (piscouEsquerdo >= 2) {
                console.log('piscou esquerdo')
                setSucessoNecessario(sucessoNecessario - 1);
                setFechouOlhos(0);
                setPiscouDireito(0);
                setPiscouEsquerdo(0);
                setOlhosAberto(true);

            }
            if (piscouDireito >= 2) {
                console.log('piscou direito')
                setSucessoNecessario(sucessoNecessario - 1);
                setFechouOlhos(0);
                setPiscouDireito(0);
                setPiscouEsquerdo(0);
                setOlhosAberto(true);

            }

            if (fechouOlhos >= 2) {
                console.log('fechou os olhos')
                setSucessoNecessario(sucessoNecessario - 1);
                setFechouOlhos(0);
                setPiscouDireito(0);
                setPiscouEsquerdo(0);
                setOlhosAberto(true);

            }
        }


    } 
  }

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
      <Title title='Pisca Pisca' />
      <SpeechText style={{}} text={'Você deve piscar os olhos de acordo com a instrução'} />
      <View style={styles.game}>
        <View style={styles.viewCamera}>
            <Camera
            style={styles.camera}
            type={CameraType.front}
            ref={cameraRef}
            onFacesDetected={handleFaceDetector}
            faceDetectorSettings={{
                mode: FaceDetector.FaceDetectorMode.fast,
                detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
                runClassifications: FaceDetector.FaceDetectorClassifications.all,
                minDetectionInterval: 100,
                tracking: true,
              }}
            >
            </Camera>
        </View>

            <Text>Comando: {currentComando + ' ' + sucessoNecessario + ' vezes'}  </Text>
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

  viewCamera: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 400,
    aspectRatio: 3/4,
    backgroundColor: 'white',
    borderRadius: 20,
    elevation: 5,
  },

  camera: {
    width: 350,
    aspectRatio: 3/4,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'gray',
  },
  picImage: {
    width: 300,
    aspectRatio:  1/1,
    transform: [{ scaleX: -1 }],
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
