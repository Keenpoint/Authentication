import React from 'react';
import {Picker, Text, View} from 'react-native';


const LanguageSwitcher = (props) => {
    const {handleLanguageSwitch, language} = props
    return (
        <View style={{ left: 10}}>
            <Text>{language}</Text>
            <Picker
                selectedValue={language}
                style={{height: 20, width: 30}}
                onValueChange={handleLanguageSwitch}>
                <Picker.Item label="fr" value="fr" />
                <Picker.Item label="en" value="en" />
            </Picker>
        </View>
    )

};


export default LanguageSwitcher;
