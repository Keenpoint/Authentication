import React, {Component} from 'react';
import { View, Button } from 'react-native';
import { WebView } from 'react-native-webview';

class TemplateView extends Component{
    render() {
        const {template, clearState} = this.props
        return (
            <View style={{flex: 1}}>
                <WebView
                    originWhitelist={['*']}
                    source={{html: `<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>${template}</body></html>` }}
                />
                <Button
                    onPress={() => clearState()}
                    style={{height: 100, width: 100}}
                    title="Quitter"
                />
            </View>
        )
    }


};

export default TemplateView;
