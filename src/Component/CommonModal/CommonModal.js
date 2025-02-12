import React from 'react';
import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import COLOR from '../../config/color.json';
import {HEIGHT, NotoSans_Medium, WIDTH} from '../../config/AppConst';

const CommonModal = ({showModal, setShowModal}) => {
  const handleLogout = () => {
    setShowModal(false);
  };

  return (
    <Modal
      transparent
      visible={showModal}
      animationType="fade"
      onRequestClose={() => setShowModal(false)}>
      <View style={styles.overlay}>
        <View style={styles.modalWrap}>
          <Text style={styles.message}>Are you Sure, cancle to here</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.noButton]}
              onPress={() => setShowModal(false)}>
              <Text style={styles.noText}>No</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.yesButton]}
              onPress={handleLogout}>
              <Text style={styles.yesText}>Yes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CommonModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalWrap: {
    padding: WIDTH(5),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    width: WIDTH(80),
    height: HEIGHT(25),
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  message: {
    fontSize: 18,
    color: 'green',
    textAlign: 'center',
    fontFamily: NotoSans_Medium,
    marginBottom: HEIGHT(2),
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginTop: HEIGHT(3),
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
