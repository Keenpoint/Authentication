import React from 'react';
import {Modal, Text, TouchableHighlight, View} from 'react-native';
import LoginController from './LoginController';

const LoginModal = (props) => {
    const {modalVisible, toggleModal, setUserSignedIn, userId} = props
    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={modalVisible}
            onRequestClose={() => {
                toggleModal(false)
            }}>
            <View style={{marginTop: 22}}>
                <LoginController setUserSignedIn={setUserSignedIn} toggleModal={toggleModal} userId={userId}/>
                <TouchableHighlight
                    onPress={() => {
                        toggleModal(!modalVisible);
                    }}>
                    <Text>Hide Modal</Text>
                </TouchableHighlight>
            </View>
        </Modal>
    );
}

export default LoginModal
