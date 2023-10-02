import { Animated, Image, StyleSheet, TouchableWithoutFeedback, View } from 'react-native'
import { Ionicons, Octicons } from '@expo/vector-icons';
import React, { useState } from 'react'
import expressionImages from '../phases/expressionImages'

interface FabButtonProp {
    avatar: string,
    style: any,
    back: () => void,
}

const FabButton: React.FC<FabButtonProp> = ({ avatar, style, back }) => {
    const [open, setOpen] = useState(false);
    const animation = new Animated.Value(open ? 1 : 0);

    const toggleMenu = () => {
        const toValue = open ? 0 : 1;

        Animated.spring(animation, {
            toValue,
            friction: 6,
            useNativeDriver: true
        }).start(() => {
            setOpen(!open);
        });
    }

    const arrowStyle = {
        transform: [
            {
                scale: animation
            },
            {
                translateX: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -150]
                })
            }
        ]
    }

    const settigsStyle = {
        transform: [
            {
                scale: animation
            },
            {
                translateX: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -90]
                })
            }
        ]
    }

    return (
        <View style={[styles.container, style]}>
            <TouchableWithoutFeedback onPress={toggleMenu}>
                <View style={[{ zIndex: 1 }, styles.avatar]}>
                    <Image source={expressionImages.avatar[avatar]} style={{ height: 50, width: 50 }} />
                </View>
            </TouchableWithoutFeedback>

            <View style={styles.actions}>
                <TouchableWithoutFeedback onPress={back}>
                    <Animated.View style={[styles.avatar, styles.menu, arrowStyle]}>
                        <Octicons name="arrow-switch" size={30} color="purple" />
                    </Animated.View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback>
                    <Animated.View style={[styles.avatar, styles.menu, settigsStyle]}>
                        <Ionicons name="md-settings" size={30} color="purple" />
                    </Animated.View>
                </TouchableWithoutFeedback>
            </View>
        </View>
    )
}

export default FabButton

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        position: 'absolute',
    },
    avatar: {
        justifyContent: 'center',
        backgroundColor: 'white',
        alignItems: 'center',
        width: 60,
        height: 60,
        borderRadius: 30,
        elevation: 5,
        position: 'absolute',
    },
    menu: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    actions: {
        flexDirection: 'row',
    }
})
