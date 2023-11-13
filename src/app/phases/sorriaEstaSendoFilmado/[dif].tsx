import { Camera, CameraType, FaceDetectionResult } from 'expo-camera';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, ImageSourcePropType, View, Dimensions, Image } from 'react-native';
import ButtonGame from '../../components/ButtonGame';

import colors from '../../config/colors';
import Title from '../../components/title';
import SpeechText from '../../components/SpeechText';
import * as FaceDetector from 'expo-face-detector';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams } from 'expo-router';
import { Dificuldade } from '../../utils/utils';
import Correct from '../../modal/Animate';


const comandos: ImageSourcePropType[] = [
  require("./../../../assets/phases/chefimMandou/1.png"),
  require("./../../../assets/phases/chefimMandou/2.png"),
  require("./../../../assets/phases/chefimMandou/3.png"),
  require("./../../../assets/phases/chefimMandou/4.png"),
  require("./../../../assets/phases/chefimMandou/5.png"),
  require("./../../../assets/phases/chefimMandou/6.png"),
  require("./../../../assets/phases/chefimMandou/7.png"),
  require("./../../../assets/phases/chefimMandou/8.png"),
]

const comandosTexto: string[] = [
  'Pare...',
  'Sorria...',

]

const { width, height } = Dimensions.get('window');

export default function ImiteAExpressao() {
  const [permission, requestPermission] = Camera.useCameraPermissions(); //Const permissao para uso da camera

  const [animated, setAnimated] = useState(false);
  const [currentComando, setCurrentComando] = useState<number>();
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

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * comandos.length)
    setCurrentComando(randomIndex)
  }, [dificuldade])



  const resetGame = () => {


  }

  const verificar= () => {

  }


  function handleFaceDetector({faces}: FaceDetectionResult){
    //console.log(faces);

    const face = faces[0] as any;

    if (face){
        


    } 
  }

  if (!permission) {
    return <View />;
  }

  //Verificar se tem acesso a câmera, se não tiver, retona
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={colors.backGroundTitle}/>
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
      <StatusBar backgroundColor={colors.backGroundTitle}/>
      <Title title='Sorria, está sendo filmado' />
      <SpeechText style={{}} text={'Você deve piscar os olhos de acordo com a instrução'} />
      <Correct isVisible={animated} onAnimationFinish={resetGame}/>
      <View style={styles.game}>
        <View style={styles.viewCamera}>
            <Camera
            style={styles.camera}
            type={CameraType.front}
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
              <View style={{width: "30%", aspectRatio: 1, marginTop: 20, backgroundColor: 'white', padding: 10, borderRadius: 10, elevation: 5}}>
                <Image source={comandos[1]} style={{width: '100%', height: '100%'}}/>
              </View>
              <View style={{width: '30%', marginTop: 10, padding: 10, backgroundColor: 'white', borderRadius: 10, elevation: 5}}>
                 <Text style={{width: '100%', fontSize: 32, color: colors.title ,fontWeight: "bold"}}>{comandosTexto[1]}  </Text>
              </View>

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
    width: '80%',
    aspectRatio: 3/4,
    backgroundColor: 'white',
    borderRadius: 20,
    elevation: 5,
  },

  camera: {
    width: '90%',
    aspectRatio: 3/4,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'gray',
  },
});
