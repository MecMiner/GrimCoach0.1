import { useState } from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import * as Speech from 'expo-speech'
import { Ionicons } from '@expo/vector-icons';


interface SpeechProps {
    text: string;
    style? : any
}

export default function SpeechText({ text, style }: SpeechProps) {
    const [isSpeaking, setIsSpeaking] = useState(false);

    const speak = () => {
        if (!isSpeaking) {
            setIsSpeaking(true);
            Speech.speak(text, {
                language: 'pt-BR',
                onDone() {
                    setIsSpeaking(false)
                },
            });

        } else {
            setIsSpeaking(false)
            Speech.stop();
        }
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity 
                onPress={speak} 
                style={[{width: 40, height: 40, borderRadius: 5, alignItems:'center', justifyContent: 'center'}, style]}
            >
                <Ionicons name={isSpeaking ? "ios-volume-mute" : "ios-volume-high"} size={32} color="purple" />
            </TouchableOpacity>
        </View>
    );
}


const styles = StyleSheet.create({
    container: { 
        padding: 10,
        position: "absolute",
        bottom: 10,
        left: 10,
        backgroundColor: 'white',
        width: 60,
        height: 60,
        borderRadius: 30,
        elevation: 5,
    }
})
