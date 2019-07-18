/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from 'react-native';

import { WebView } from 'react-native-webview';

import {startNFC, stopNFC} from "./NFCHelper";

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      titleMessage: "Move the device closer to an NFC tag",
      descriptionMessage: "Waiting for approach...",
      nfcStarted: false,
      tag: {},
      tagID: null,
      template: null,
      error: null,
      apiMessage: null
    };
    this.hasStartedNFC = this.hasStartedNFC.bind(this)
    this.handleNFCTagReading = this.handleNFCTagReading.bind(this)
  }

  componentWillMount() {
    startNFC(this.handleNFCTagReading, this.hasStartedNFC);
  }

  componentWillUnmount() {
    stopNFC(this.hasStartedNFC);
  }

  hasStartedNFC(bool) {
    this.setState({nfcStarted: bool})
  }

  clearState() {
    this.setState({
      tag: {},
      tagID: null,
      template: null,
      apiMessage: null,
      error: null
    })
  }

  handleNFCTagReading = nfcResult => {
    if (nfcResult.Error) {
      this.setState({
        titleMessage: nfcResult.Error.Title,
        descriptionMessage: nfcResult.Error.Message
      });
    } else {

      fetch(`http://172.20.0.23:9003/AuthApi/${nfcResult.tag.id}`)
          .then((response) => response.json())
          .then((responseJson) => {
            this.setState({
              tag: nfcResult.tag,
              tagID: nfcResult.tag.id,
              template: responseJson.template,
              apiMessage: responseJson.message
            });
          })
          .catch((error) =>{
            this.setState({
              tag: nfcResult.tag,
              tagID: nfcResult.tag.id,
              descriptionMessage: error.message
            })
          });
    }
  };

  render(){
    const {nfcStarted, titleMessage, descriptionMessage, tagID, template, apiMessage} = this.state
    return template
        ? (
            <View style={styles.container}>
              <WebView source={{html: `<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>${template}</body></html>` }} style={{margin: 20}} />
              <TouchableOpacity style={{ marginBottom: 20, marginLeft: 20, textAlign: "center" }} onPress={this.clearState.bind(this)}>
                <Text>Clear tag</Text>
              </TouchableOpacity>
            </View>
        )
        : (
            <View style={styles.container}>
              <Text style={styles.headerMessage}>NFC Tag Reader</Text>
              {
                nfcStarted && <Text style={styles.titleMessage}>NFC started</Text>
              }

              {
                apiMessage
                  ? <Text style={styles.titleMessage}>{apiMessage}</Text>
                  : <Text style={styles.titleMessage}>{titleMessage}</Text>
              }
              {
                !apiMessage && <Text style={styles.descriptionMessage}>{descriptionMessage}</Text>
              }
              <Text style={{ marginTop: 20 }}>{`Current tag ID: ${tagID}`}</Text>
              <TouchableOpacity style={{ marginTop: 20 }} onPress={this.clearState.bind(this)}>
                <Text>Clear tag</Text>
              </TouchableOpacity>
            </View>
        )

  }

};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerMessage: {
    fontWeight: "bold",
    fontSize: 32
  },
  titleMessage: {
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 34
  },
  descriptionMessage: {
    fontWeight: "normal",
    fontSize: 16,
    marginTop: 12,
  },
  tagValue: {
    fontWeight: "normal",
    fontSize: 16,
    marginTop: 18,
    color: "#77D353"
  }
});

export default App;
