import { View, StyleSheet } from 'react-native'
import React from 'react'
import { FontAwesome } from '@expo/vector-icons';

interface StatusGameProps {
    total: number,
    atual: number,
}

const StatusGame:React.FC<StatusGameProps> = ({total, atual}) => {
    const statusElements: JSX.Element[] = Array.from({ length: total }, (_, index) => {
        if( index < atual) {return (
            <FontAwesome key={index} name="circle" size={8} color="purple" />
        )}
        return (
            <FontAwesome key={index} name="circle-o" size={8} color="purple" />
          )
    });

  return (
    <View style={styles.container}>
        {statusElements}
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        width: 200,
        backgroundColor: 'white',
        height: 40,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        borderWidth: 1,
        borderColor: '#FFF',
        flexDirection: 'row', // Para exibir os ícones horizontalmente
        justifyContent: 'space-around', // Para espaçamento uniforme
        alignItems: 'center', // Alinhe os ícones verticalmente
        paddingHorizontal: 10,
        elevation: 5,
    }
})

export default StatusGame