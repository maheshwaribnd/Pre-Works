import React from 'react';
import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import COLOR from '../../config/color.json';
import {HEIGHT, NotoSans_Medium, WIDTH} from '../../config/AppConst';

const LogoutComp = ({showModal, setShowModal, text, onpress}) => {
  return (
    <Modal
      transparent
      visible={showModal}
      animationType="fade"
      onRequestClose={() => setShowModal(false)}>
      <View style={styles.overlay}>
        <View style={styles.modalWrap}>
          <Text style={styles.Heading}>{text}</Text>

          <Text style={styles.message}>Are you Sure, You Want to {text}?</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.noButton]}
              onPress={() => setShowModal(false)}>
              <Text style={styles.noText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.yesButton]}
              onPress={onpress}>
              <Text style={styles.yesText}>Okay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LogoutComp;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalWrap: {
    paddingVertical: WIDTH(3),
    paddingHorizontal: WIDTH(3),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    width: WIDTH(85),
    height: HEIGHT(28),
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },

  Heading: {
    fontSize: 21,
    color: COLOR.Black,
    textAlign: 'left',
    fontFamily: NotoSans_Medium,
    marginBottom: HEIGHT(1),
  },

  message: {
    fontSize: 16,
    color: COLOR.Gray9,
    textAlign: 'center',
    fontFamily: NotoSans_Medium,
    marginBottom: HEIGHT(2),
  },

  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginTop: HEIGHT(2),
  },
  button: {
    flex: 1,
    paddingVertical: HEIGHT(1.5),
    borderRadius: 30,
    alignItems: 'center',
    marginHorizontal: WIDTH(2),
  },
  noButton: {
    backgroundColor: '#E0E0E0',
  },
  yesButton: {
    backgroundColor: 'orange',
  },
  noText: {
    color: '#555',
    fontSize: 16,
    fontFamily: NotoSans_Medium,
  },
  yesText: {
    color: 'white',
    fontSize: 16,
    fontFamily: NotoSans_Medium,
  },
});
