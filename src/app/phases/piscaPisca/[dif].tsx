import { Camera, CameraType, FaceDetectionResult } from 'expo-camera';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
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
import { Entypo } from '@expo/vector-icons';
import { PersonData } from '../../components/types';


const comandos = [
    'Pisque ambos os olhos',
    'Pisque o olho direito',
    'Pisque o olho esquerdo'
  ];

const { width, height } = Dimensions.get('window');

export default function ImiteAExpressao() {
  const [permission, requestPermission] = Camera.useCameraPermissions(); //Const permissao para uso da camera
  let piscouDireito = 0;
  let fechouOlhos = 0;
  let piscouEsquerdo = 0;
  const [atual, setAtual] = useState (1)
  const [animated, setAnimated] = useState(false);
  const [currentComando, setCurrentComando] = useState(
    comandos[Math.floor(Math.random() * comandos.length)]   
  );
  const [dificuldade, setDificuldade] = useState<Dificuldade>('facil')
  const [sucessoNecessario, setSucessoNecessario] = useState(0);
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
            updatedUser.fasesCompletas.piscaPica[dificuldade] += 1;
  
            // Registra o tempo gasto
            updatedUser.tempoJogado.piscaPica[dificuldade] += tempoRef.current;
  
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

  const difficultyMap = {
    facil: 3,
    medio: 5,
    dificil: 7,
  };

  useEffect(() => {
    if (diff && (diff in difficultyMap)) {
      setDificuldade(diff as Dificuldade);
      setSucessoNecessario(difficultyMap[diff as Dificuldade]);
    }
  }, [diff]);





  const resetGame = () => {
    setAnimated(false);
    if (atual < 3){
      let randomIndex = Math.floor(Math.random() * comandos.length);
      let newCommand = comandos[randomIndex];
      setCurrentComando(newCommand);
      setSucessoNecessario(difficultyMap[dificuldade]); 
      setAtual(atual + 1);    
    } else {
      setConcluiuFase(true);
      salvarProgresso();
    }


  }

  const verificar= () => {
    piscouEsquerdo = (0);
    piscouDireito = (0);
    fechouOlhos = (0);
    const sucesso = sucessoNecessario - 1
    if (sucesso <= 0){
        console.log('correto');
        setAnimated(true);


    } else {
      setSucessoNecessario(sucesso);

    }
  }


  const  handleFaceDetector = ({faces}: FaceDetectionResult) => {
    //console.log(faces);

    const face = faces[0] as any;

    if (face){
        if (currentComando == 'Pisque o olho esquerdo'){
            if(face.leftEyeOpenProbability > 0.5 && face.rightEyeOpenProbability < 0.3){
                piscouEsquerdo = piscouEsquerdo + 1;
            }
        }
        if (currentComando === 'Pisque o olho direito') {
            if (face.rightEyeOpenProbability > 0.5 && face.leftEyeOpenProbability < 0.3){
                piscouDireito = (piscouDireito + 1);

            } 
        }
        
        if (currentComando === 'Pisque ambos os olhos') {
            if (face.rightEyeOpenProbability < 0.3 && face.leftEyeOpenProbability < 0.3){
                fechouOlhos = (fechouOlhos + 1);
            } 
        }


        if (face.rightEyeOpenProbability > 0.3 && face.leftEyeOpenProbability > 0.3){
            
            if (piscouEsquerdo >= 4) {
                verificar();

            }
            if (piscouDireito >= 4) {
                verificar();

            }

            if (fechouOlhos >= 4) {
                verificar();

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
      <Title title='Pisca Pisca' />
      <StatusGame atual={atual} total={3}/>
      <SpeechText style={{}} text={'Você deve piscar os olhos de acordo com a instrução'} />
      <Correct isVisible={animated} onAnimationFinish={resetGame}/>
      <SuccessModal isVisible={concluiuFase} nextPag={``}/>
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
              <View style={{width: '90%', marginTop: 20, backgroundColor: 'white', padding: 10, borderRadius: 10, elevation: 5}}>
                <Text style={{fontSize: 32, color: colors.title ,fontWeight: "bold"}}>{currentComando + ' ' + sucessoNecessario + ' vezes'}  </Text>

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
  
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  
  viewCompare: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    width: 120,
    height: 120,
    borderRadius: 60,
    elevation: 5,
  },
});
