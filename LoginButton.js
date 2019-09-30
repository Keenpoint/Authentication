import {Text, TouchableOpacity} from 'react-native';
import React from 'react';

const LoginButton = (props) => (
    <TouchableOpacity
        onPress={() => {
            if(props.userId){
                props.setUserSignedOut()
            }else{
                props.toggleModal(true)
            }
        }}
        style={{
            borderWidth:1,
            borderColor:'rgba(0,0,0,0.2)',
            alignItems:'center',
            justifyContent:'center',
            width:70,
            position: 'absolute',
            zIndex: 55,
            top: 10,
            right: 10,
            height:25,
            backgroundColor:'#fff',
            borderRadius:4,
        }}
    >
        <Text>{props.userId ? 'Sign out' : 'Sign in' }</Text>
    </TouchableOpacity>
)

export default LoginButton
