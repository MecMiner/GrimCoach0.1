import { Camera, CameraCapturedPicture, CameraType } from 'expo-camera';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, Dimensions, ActivityIndicator } from 'react-native';
import ButtonGame from '../../components/ButtonGame';

import axios from 'axios';
import colors from '../../config/colors';
import Title from '../../components/title';
import SpeechText from '../../components/SpeechText';
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Dificuldade, loadPerfilLogado, salvarAvanco, shuffleArray } from '../../utils/utils';
import { useLocalSearchParams } from 'expo-router';
import expressionImages from '../../config/expressionImages';
import Correct from '../../modal/Animate';
import StatusGame from '../../components/StatusGame';
import SuccessModal from '../../modal/sucess';
import { PersonData } from '../../components/types';

interface Respost {
  angerLikelihood: string | null,
  joyLikelihood: string | null,
  surpriseLikelihood: string | null,
  sorrowLikelihood: string | null,
}


const expressionName: string[] = [
  'feliz',
  'raiva',
  'triste',
  'surpreso',
];

const { width, height } = Dimensions.get('window');

export default function ImiteAExpressao() {

  //Constantes Camera
  const [permission, requestPermission] = Camera.useCameraPermissions(); //Const permissao para uso da camera
  const [openCamera, setOpenCamera] = useState(false); //Estado de abertura de camera
  const cameraRef = useRef<Camera | null>(null);

  //Constantes sucesso de fase
  const [animate, setAnimate] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

  const [image, setImage] = useState<string | null>(null); //Const para setar caminho da imagem
  const [imageBase64, setImageBase64] = useState<string | undefined>(undefined); //Const para setar imagem 64 bits
  const [respost, setRespost] = useState<string | null>(); //Const resposta para conferir
  const [analyzing, setAnalyzing] = useState<boolean>(false); //Verificar estado da análise
  const [expression, setExpression] = useState<string[]>([]); // Inicialize com uma emoção padrão
  const [current, setCurrent] = useState<number>(1); //Inicial parte da fase em que esta
  const [feedback, setFeedback] = useState<string>('');

  //Constantes de dificuldade da fase
  const [dificuldade, setDificuldade] = useState<Dificuldade>('facil')
  const { dif } = useLocalSearchParams();

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
            updatedUser.fasesCompletas.imiteAExpressao[dificuldade] += 1;
  
            // Registra o tempo gasto
            updatedUser.tempoJogado.imiteAExpressao[dificuldade] += tempoRef.current;
  
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

  const diff = Array.isArray(dif) ? dif[0] : dif;

  useEffect(() => {
    if (diff === 'facil' || diff === 'medio' || diff === 'dificil') {
      setDificuldade(diff);
    }
  }, [diff]);

  useEffect(() => {
    console.log(respost)
    if (respost){
      checkEmotion(respost);
    }

  }, [respost])


  useEffect(() => {
    // Embaralha as emoções
    const randomEmotion = shuffleArray(expressionName)

    // Define um array de emoções aleatórias
    setExpression(randomEmotion);
  }, []);
  
  const checkEmotion = (selectedEmotion: string) => {
    if (selectedEmotion === expression[current]) {
      setAnimate(true);
    } else {
      setImage(null);
      setImageBase64(undefined);
      setFeedback('Tente novamente, a expressão não corresponde.');
    }
  };



  const resetPhase = () => {
    setAnimate(false)
    if (current < 3) {
    // Limpa o campo de entrada e feedback
    setFeedback('');
    setImage(null)
    setImageBase64(undefined)

    // Proxima emoção
    setCurrent(current + 1);
    } else {
      setIsSuccessModalVisible(true);
      salvarProgresso();
    }

  };
  

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
      if (respost.angerLikelihood === "LIKELY" && (dificuldade === 'medio' || dificuldade === 'facil')) {
        return "raiva";
      }
      if (respost.joyLikelihood === "LIKELY" && (dificuldade === 'medio' || dificuldade === 'facil')) {
        return "feliz";
      }
      if (respost.surpriseLikelihood === "LIKELY" && (dificuldade === 'medio' || dificuldade === 'facil')) {
        return "surpreso";
      }
      if (respost.sorrowLikelihood === "LIKELY" && (dificuldade === 'medio' || dificuldade === 'facil')) {
        return "triste";
      }

      // Verifica se alguma propriedade tem valor 'PROBABLE", sozinho.
      if (respost.angerLikelihood === "PROBABLE" &&
        respost.joyLikelihood != "PROBABLE" &&
        respost.surpriseLikelihood != "PROBABLE" &&
        respost.sorrowLikelihood != "PROBABLE" && 
        dificuldade === 'facil') {

        return "raiva";
      }
      if (respost.joyLikelihood === "PROBABLE" &&
        respost.angerLikelihood != "PROBABLE" &&
        respost.surpriseLikelihood != "PROBABLE" &&
        respost.sorrowLikelihood != "PROBABLE" && 
        dificuldade === 'facil') {
        return "feliz";
      }
      if (respost.surpriseLikelihood === "PROBABLE" &&
        respost.joyLikelihood != "PROBABLE" &&
        respost.angerLikelihood != "PROBABLE" &&
        respost.sorrowLikelihood != "PROBABLE" &&
        dificuldade === 'facil') {
        return "surpreso";
      }
      if (respost.sorrowLikelihood === "PROBABLE" &&
        dificuldade === 'facil') {
        return "triste";
      }

      if (respost.angerLikelihood === "UNLIKELY" &&
      respost.joyLikelihood != "UNLIKELY" &&
      respost.surpriseLikelihood != "UNLIKELY" &&
      respost.sorrowLikelihood != "UNLIKELY" && 
      dificuldade === 'facil') {

      return "raiva";
    }
    if (respost.joyLikelihood === "UNLIKELY" &&
      respost.angerLikelihood != "UNLIKELY" &&
      respost.surpriseLikelihood != "UNLIKELY" &&
      respost.sorrowLikelihood != "UNLIKELY" && 
      dificuldade === 'facil') {
      return "feliz";
    }
    if (respost.surpriseLikelihood === "UNLIKELY" &&
      respost.joyLikelihood != "UNLIKELY" &&
      respost.angerLikelihood != "UNLIKELY" &&
      respost.sorrowLikelihood != "UNLIKELY" &&
      dificuldade === 'facil') {
      return "surpreso";
    }
    if (respost.sorrowLikelihood === "UNLIKELY" &&
      dificuldade === 'facil') {
      return "triste";
    }
      return 'nada'
    }

    // Se nenhum dos casos anteriores for verdadeiro, retorna null
    return 'nada';

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


        const data: CameraCapturedPicture | null  = await cameraRef.current.takePictureAsync(option);

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
      <Correct isVisible={animate} onAnimationFinish={resetPhase} />
      <StatusGame atual={current} total={3}/>
      <View style={styles.game}>
        <View style={styles.viewCamera}>

          {image ?
            <Image style={styles.picImage} source={{ uri: image }} />
            :

            <Camera
              style={styles.camera}
              type={CameraType.front}
              ref={cameraRef}
            >
                        {expressionImages[dificuldade][expression[current]] && (
              <Image
                source={expressionImages[dificuldade][expression[current]][Math.floor(Math.random() * expressionImages[dificuldade][expression[current]].length)]}
                style={styles.image}
              />
          )}

            </Camera>
          }
        </View>
        <View>
          <View style={{ flexDirection: 'row', marginTop: 20 }}>
            {image ?
              <TouchableOpacity style={styles.buttonCamera} onPress={() => setImage(null)}>
                <MaterialCommunityIcons name="file-image-remove" size={24} color="black" />
              </TouchableOpacity>
              :
              <TouchableOpacity style={styles.buttonCamera} onPress={takePicture}>
                <Entypo name="camera" size={24} color="black" />
              </TouchableOpacity>
            }

            <View style={{ width: 80, justifyContent: 'center' }}>

              <TouchableOpacity style={[styles.button, {    backgroundColor: `${image ? '#A2FFB9' : '#FFA2A2'}`}]} disabled={!image ? true : false} onPress={analyzeImage}>
                {analyzing ? (
                  <>
                    <ActivityIndicator size="small" color="#0000ff" />
                  </>
                ) : (
                  <Text style={{ fontSize: 20, fontWeight: 'bold', }}>Verificar</Text>
                )}
              </TouchableOpacity>


            </View>

 
          </View>
        </View>
        <Text style={styles.feedback}>{feedback}</Text>
      </View>
      <SuccessModal isVisible={isSuccessModalVisible}   nextPag={''}/>
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
    width: 350,
    aspectRatio: 3 / 4,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    borderColor: 'gray',
  },
  picImage: {
    width: 350,
    aspectRatio: 3 / 4,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'gray',
    transform: [{ scaleX: -1 }],
  },
  viewCamera: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 400,
    aspectRatio: 3 / 4,
    backgroundColor: 'white',
    borderRadius: 20,
    elevation: 5,

  },

  buttonCamera: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    backgroundColor: 'white',
    height: 80,
    borderRadius: 40,
    elevation: 5,
  },

  image: {
    width: 100,
    height: 100,
    marginBottom: 20,
    borderRadius: 50,
    marginTop: 20,
  },



  button: {
    elevation: 5,
    borderRadius: 20,
    marginHorizontal: 10,
    borderColor: 'gray',
    height: 45,
    width: 130,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

  },

  feedback: {
    marginTop: 20,
    fontSize: 16,
    color: '#333',
  },

  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
