import React from 'react';
import { Modal, View, ScrollView, TouchableOpacity, Image, StyleSheet, ImageSourcePropType } from 'react-native';
import expressionImages from '../config/expressionImages';

interface SelectedAvatarProps {
    isVisible: boolean;
    setAvatar: (avatar: ImageSourcePropType) => void;
    onClose: () => void;
    setAvatarName: (name: string) => void;

}

const SelectedAvatar:React.FC<SelectedAvatarProps> = ({isVisible, setAvatar, onClose, setAvatarName}) => {


  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ScrollView>
            <View style={styles.avatarGrid}>
              {Object.keys(expressionImages.avatar).map((avatarName, index) => {
                const isLastInRow = (index + 1) % 3 === 0;
                return (
                  <TouchableOpacity
                    key={avatarName}
                    onPress={() => {
                        console.log(avatarName)
                      setAvatar(expressionImages.avatar[avatarName]);
                      setAvatarName(avatarName);
                      onClose();
                    }}
                    style={styles.avatarGridItem}
                  >
                    <Image
                      source={expressionImages.avatar[avatarName]}
                      style={styles.avatarSelectionImage}
                    />
                    {isLastInRow && <View style={styles.lineBreak} />}
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end', // Modal aparece na parte inferior da tela
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  avatarGridItem: {
    width: '30%', 
    margin: 5,
    alignItems: 'center',
  },
  lineBreak: {
    width: '100%', 
  },
  avatarSelectionImage: {
    width: 80,
    height: 80,
    margin: 5,
  },
});

export default SelectedAvatar;