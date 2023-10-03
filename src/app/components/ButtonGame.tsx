import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import React from 'react'

interface ButtomGameProps {
    text: string,
    onPress: () => void,
    style: any,
}

const ButtonGame: React.FC<ButtomGameProps> = ({text, onPress, style}) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, style]}> 
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  )
}

export default ButtonGame

const styles = StyleSheet.create({
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 130,
        height: 50,
        borderRadius: 30,
    },
    text :{
        padding: 10,
        fontSize: 20,
        fontWeight: 'bold',
    }
})