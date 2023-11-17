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
  'Sério de olhos abertos',
  'Sorrindo de olhos abertos',
  'Sério de olhos fechados',
  'Sorrindo de olhos fechado',
  'Sério, piscando olho esquerdo',
  'Sorrindo, piscando olho esquerdo',
  'Sério, piscando olho direito',
  'Sorrindo, piscando olho direito',

]

const { width, height } = Dimensions.get('window');

export default function ImiteAExpressao() {
  const [permission, requestPermission] = Camera.useCameraPermissions(); //Const permissao para uso da camera

  const [animated, setAnimated] = useState(false);
  const [currentComando, setCurrentComando] = useState<number>(7);
  const [dificuldade, setDificuldade] = useState<Dificuldade>('facil')
  const [sucessoNecessario, setSucessoNecessario] = useState(0);
  const [atual, setAtual]= useState(1);
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
            updatedUser.fasesCompletas.chefinMandou[dificuldade] += 1;
  
            // Registra o tempo gasto
            updatedUser.tempoJogado.chefinMandou[dificuldade] += tempoRef.current;
  
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

  let emocao =  0;



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

  const atualizarGame= ()=>{
    emocao = 0;
    const randomIndex = Math.floor(Math.random() * comandos.length)
    setCurrentComando(randomIndex)
  }

  useEffect(() => {
  atualizarGame();
  }, [dificuldade])

  



  const resetGame = () => {
    setAnimated(false);
    if(atual < 5){
      setAtual(atual + 1 )
      atualizarGame();
    } else {
      setConcluiuFase(true);
      salvarProgresso();
    }
    


  }

  const verificar= () => {

  }



  const  handleFaceDetector = ({faces}: FaceDetectionResult) => {
    //console.log(faces);

    const face = faces[0] as any;

    if (face){
      if (face.leftEyeOpenProbability > 0.5 && face.rightEyeOpenProbability > 0.5 && face.smilingProbability < 0.3 && currentComando === 0)  {
        emocao += 1;
        if (emocao > 5){
          setAnimated(true);
        }
      }
      if (face.leftEyeOpenProbability > 0.5 && face.rightEyeOpenProbability > 0.5 && face.smilingProbability > 0.9 && currentComando === 1)  {
        emocao += 1;
        if (emocao > 5){
          setAnimated(true);
        }
      }
      if (face.leftEyeOpenProbability < 0.3 && face.rightEyeOpenProbability < 0.3 && face.smilingProbability < 0.3 && currentComando === 2)  {
        emocao += 1;
        if (emocao > 5){
          setAnimated(true);
        }
      }
      if (face.leftEyeOpenProbability < 0.3 && face.rightEyeOpenProbability < 0.3 && face.smilingProbability > 0.9 && currentComando === 3)  {
        emocao += 1;
        if (emocao > 5){
          setAnimated(true);
        }
      }
      if (face.leftEyeOpenProbability > 0.4 && face.rightEyeOpenProbability < 0.4 && face.smilingProbability < 0.3 && currentComando === 4)  {
        emocao += 1;
        if (emocao > 5){
          setAnimated(true);
        }
      }
      if (face.leftEyeOpenProbability > 0.4 && face.rightEyeOpenProbability < 0.4 && face.smilingProbability > 0.9 && currentComando === 5)  {
        emocao += 1;
        if (emocao > 5){
          setAnimated(true);
        }
      }
      if (face.leftEyeOpenProbability < 0.4 && face.rightEyeOpenProbability > 0.4 && face.smilingProbability < 0.3 && currentComando === 6)  {
        emocao += 1;
        if (emocao > 5){
          setAnimated(true);
        }
      }
      if (face.leftEyeOpenProbability < 0.4 && face.rightEyeOpenProbability > 0.4 && face.smilingProbability > 0.9 && currentComando === 7)  {
        emocao += 1;
        if (emocao > 5){
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
      <Title title='Chefim Mandou' />
      <StatusGame atual={atual} total={5}/>
      <SpeechText style={{}} text={'Você deve piscar os olhos de acordo com a instrução'} />
      <Correct isVisible={animated} onAnimationFinish={resetGame}/>
      <SuccessModal isVisible={concluiuFase} nextPag={('/selectLevel')}/>
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
              <View style={{width: '90%', marginTop: 10, padding: 10, backgroundColor: 'white', borderRadius: 10, elevation: 5}}>
              <Text style={{fontSize: 32, color: colors.title ,fontWeight: "bold"}}>{comandosTexto[currentComando]}  </Text>
              </View>
              <View style={{width: "30%", aspectRatio: 1, marginTop: 20, backgroundColor: 'white', padding: 10, borderRadius: 10, elevation: 5}}>
                <Image source={comandos[currentComando]} style={{width: '100%', height: '100%'}}/>
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
