import { Modal, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import AnimatedLottieView from 'lottie-react-native'

interface AnimatesProp{
    isVisible: boolean,
    onAnimationFinish: () => void
}

const Correct:React.FC<AnimatesProp> = ({isVisible, onAnimationFinish}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
    >
      <View style={styles.modalBackground}>
        <AnimatedLottieView
          source={require('./../../assets/animacoes/sucess.json')}
          autoPlay
          loop={false}
          style={styles.lottieView}
          duration={2000}
          onAnimationFinish={onAnimationFinish}
        />
      </View>
    </Modal>
  )
}

export default Correct

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
      },
      
      lottieView: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
      },
})