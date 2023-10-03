import { Camera, CameraType } from 'expo-camera';
import { useRef, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image, Modal } from 'react-native';
import ButtonGame from '../components/ButtonGame';

import { Entypo } from '@expo/vector-icons';
import axios from 'axios';

export default function App() {
  const [type, setType] = useState(CameraType.front);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [image, setImage] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const cameraRef = useRef(null);

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const analyzeImage = async () =>{
    try {
      if (!imageBase64){
        alert('Por favor, selecione a imagem primeiro');
        return;
      }

      // carrrengado api
      const apiKey = 'AIzaSyCkMA9XocCebpM5JsG5-EHXesCK9FkvV8w';
      const apiURL = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`

      const requestData= {
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
        setImage(data.uri)
        setImageBase64(data.base64)
        console.log(data.base64)
      } catch (error) {
        console.log(error)
      }
    }
  }

  return (
    <View style={styles.container}>
      {!image ?
        <Modal transparent={false}>
          <Camera
            style={styles.camera}
            type={type}
            ref={cameraRef}
          >
          <TouchableOpacity onPress={takePicture} style={{marginVertical: 30}}>
              <Entypo name="camera" size={40} color="black" />
          </TouchableOpacity>
          </Camera>
        </Modal>

        :
        <Image style={styles.picImage} source={{ uri: image }} />
      }
      <View>
        <TouchableOpacity onPress={image?  () => setImage(null): takePicture} style={{marginVertical: 30}}>
          {image ?
          <Entypo name="circle-with-cross" size={40} color="black" />
          :
          <Entypo name="camera" size={40} color="black" />}
        </TouchableOpacity>

        <Button title='enviar imagem' onPress={analyzeImage}/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    aspectRatio: 1728/2304,
    borderRadius: 60,
  },
  picImage: {
    width: 300,
    aspectRatio: 1728/2304,
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
