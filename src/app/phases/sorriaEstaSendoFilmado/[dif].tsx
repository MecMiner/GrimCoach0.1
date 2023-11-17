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
import { Dificuldade, loadPerfilLogado, salvarAvanco } from '../../utils/utils';
import Correct from '../../modal/Animate';
import StatusGame from '../../components/StatusGame';
import SuccessModal from '../../modal/sucess';
import { PersonData } from '../../components/types';



const comandosTexto: string[] = [
  'Pare...',
  'Sorria...',

]

const { width, height } = Dimensions.get('window');

export default function ImiteAExpressao() {
  const [permission, requestPermission] = Camera.useCameraPermissions(); //Const permissao para uso da camera
  let sorrindo = 0;
  let parouSorriso = 0;
  const [animated, setAnimated] = useState(false);
  const [currentComando, setCurrentComando] = useState<number>(1);
  const [dificuldade, setDificuldade] = useState<Dificuldade>('facil')
  const [sucessoNecessario, setSucessoNecessario] = useState(0);
  const [atual, setAtual] = useState(1);
  const [concluiuFase, setConcluiuFase] = useState(false);

  
  const [user,setUser] = useState<PersonData>();
  const tempoRef = useRef(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      tempoRef.current += 1;
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const carregarPerfil = async () => {
      const profile = await loadPerfilLogado();
      if (profile) {
        setUser(profile);
      }
    };
  
    carregarPerfil();
  }, []); //Carreganmento de Perfil do Usuário

  const salvarProgresso = async () => {
    try {
      await new Promise<void>((resolve) => {
        setUser((prevUser) => {
          if (prevUser) {
            const updatedUser = { ...prevUser };
  
            // Adiciona pontos
            updatedUser.pontos += 10;
  
            // Marca a fase como concluída
            updatedUser.fasesCompletas.sorriaEstaSendoFilmado[dificuldade] += 1;
  
            // Registra o tempo gasto
            updatedUser.tempoJogado.sorriaEstaSendoFilmado[dificuldade] += tempoRef.current;
  
            // Atualiza o estado e resolve a Promise quando a atualização estiver completa
            resolve();
            return updatedUser;
          }
  
          return prevUser;
        });
      });
  
      // Depois que a Promise é resolvida, chama salvarAvanco
      if (user) {
        salvarAvanco(user);
      }
    } catch (error) {
      console.error('Erro ao salvar o progresso:', error);
    }
  };


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
      console.log('aqui 1')
  }, [diff]);




  const resetGame = () => {
    setAnimated(false);
    if(atual < 5){
      setCurrentComando(1);
      setAtual(atual+1)
    } else {
      setConcluiuFase(true);
      salvarProgresso();
    }

  }

  const verificar= () => {

  }




  const  handleFaceDetector = ({faces}: FaceDetectionResult) => {


    const face = faces[0] as any;

    if (face){

      if (face.smilingProbability > 0.5){
        parouSorriso = 0;
        sorrindo = sorrindo + 1;
        if (sorrindo > 5){
          setCurrentComando(0)
        }
      } else {
        sorrindo = 0;
        parouSorriso = parouSorriso + 1;
        if (parouSorriso > 5 && currentComando === 0){
          setAnimated(true);
         
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
      <StatusGame atual={atual} total={5}/>
      <SpeechText style={{}} text={'Você sorrir ou parar de sorri quando for pedido'} />
      <Correct isVisible={animated} onAnimationFinish={resetGame}/>
      <SuccessModal isVisible={concluiuFase} nextPag={'/selectLevel'}/>
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
              <View style={{width: '30%', marginTop: 10, padding: 10, backgroundColor: 'white', borderRadius: 10, elevation: 5}}>
                 <Text style={{width: '100%', fontSize: 32, color: colors.title ,fontWeight: "bold"}}>{comandosTexto[currentComando]}  </Text>
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
