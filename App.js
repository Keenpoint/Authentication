/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import { StyleSheet, View, Text, Image, Button, Picker, ImageBackground } from 'react-native';
import ProductCard from './ProductCard'
import Loader from './Loader'
import TemplateView from './TemplateView'
import {startNFC, stopNFC} from "./NFCHelper";
import en from './translations/en'
import fr from './translations/fr'

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      translate: props.translate,
      titleMessage: this.t(props.translate,"Rapprocher l'appareil d'un produit"),
      descriptionMessage: "En attente d'approche...",
      nfcStarted: false,
      tag: {},
      tagID: null,
      sku: null,
      productTitle: null,
      template: null,
      error: null,
      apiMessage: null,
      templateMode: false
    };
    this.hasStartedNFC = this.hasStartedNFC.bind(this)
    this.handleNFCTagReading = this.handleNFCTagReading.bind(this)
    this.clearState = this.clearState.bind(this)
    this.handleTemplateModeChange = this.handleTemplateModeChange.bind(this)
    this.t = this.t.bind(this)
  }

  componentDidMount() {
    startNFC(this.handleNFCTagReading, this.hasStartedNFC)
  }

  componentWillUnmount() {
    stopNFC(this.hasStartedNFC)
  }

  t(translate, expression) {
    const result = translate ? en[expression] : fr[expression]
    return result || expression
  }


  async restart() {
    await stopNFC(this.hasStartedNFC)
    await startNFC(this.handleNFCTagReading, this.hasStartedNFC)
  }

  hasStartedNFC(bool) {
    this.setState({nfcStarted: bool})
  }
  clearState() {
    this.setState({
      titleMessage: this.t(this.state.translate,"Rapprocher l'appareil d'un produit"),
      descriptionMessage: "En attente d'approche...",
      tag: {},
      tagID: null,
      template: null,
      apiMessage: null,
      error: null,
      sku: null,
      productTitle: null,
      templateMode: false
    })
  }

  handleTemplateModeChange() {
    this.setState({templateMode: true})
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
          .then((jsonResponse) => {
            if(jsonResponse.errorMessage) {
              this.setState({
                tag: nfcResult.tag,
                tagID: nfcResult.tag.id,
                sku: jsonResponse.sku,
                productTitle: jsonResponse.productTitle,
                descriptionMessage: this.t(this.state.translate,jsonResponse.errorMessage)
              })
            } else {
              this.setState({
                tag: nfcResult.tag,
                tagID: nfcResult.tag.id,
                sku: jsonResponse.sku,
                productTitle: jsonResponse.productTitle,
                template: jsonResponse.template,
                apiMessage: jsonResponse.message
              });
            }
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
    const { titleMessage, descriptionMessage, tagID, sku, productTitle, template, templateMode, translate } = this.state;

    return template && templateMode
            ? <TemplateView template={template} clearState={this.clearState}/>
            : (
                <View>
                  <ImageBackground source={require('./img/background_image.jpg')} resizeMode='repeat' style={{opacity: 0.3, justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%'}}/>
                  <View style={{
                    ...styles.container,
                    backgroundColor: tagID && 'rgba(16,16,16,0.2)',
                    position: 'absolute',
                    zIndex: 4
                  }}>
                    <View style={{position:'absolute', right: 0}}>
                      <Text>{this.state.translate? 'EN' : 'FR'}</Text>
                      <Picker
                          selectedValue={this.state.translate ? "en": "fr"}
                          style={{height: 20, width: 30}}
                          onValueChange={ itemValue => {
                            this.setState({
                              translate: itemValue === "en",
                              titleMessage: this.t(itemValue === "en","Rapprocher l'appareil d'un produit"),
                            })
                          }}>
                        <Picker.Item label="fr" value="fr" />
                        <Picker.Item label="en" value="en" />
                      </Picker>
                    </View>
                    <View style={styles.logoContainer}>
                      <Image source={require('./img/Blason-seul.png')} style={{height: 220, width: 220, backgroundColor: 'transparent', marginTop: 30}}/>
                    </View>
                    <View style={styles.title}>
                      <Text style={{fontSize: 18, color: 'black', fontWeight: '300', fontFamily: 'Garamond, Times New Roman, Serif', marginTop: 30}}>{this.t(translate, "appTitle")}</Text>
                    </View>

                    <View style={styles.loadingArea}>
                      {
                        !tagID
                            ? (
                                <View>
                                  <Loader/>
                                  <Text style={{textAlign: 'center', marginBottom: 40}}> {titleMessage} </Text>
                                </View>
                            )
                            : sku ? (
                                <ProductCard
                                    productTitle={productTitle}
                                    handleTemplateModeChange={this.handleTemplateModeChange}
                                    sku={sku}
                                    clearState={() => this.clearState()}
                                    t={expression => this.t(this.state.translate, expression)}
                                />
                            )
                            : (
                                <View>
                                  <Text style={{textAlign: 'center', fontSize: 18, marginBottom: 30}}> {descriptionMessage} </Text>
                                  <Button
                                      onPress={() => {
                                        this.restart().then(() => this.clearState())
                                      }}
                                      style={{fontFamily: 'Times New Roman, Serif'}}
                                      color='#e94e24'
                                      title={this.t(translate,"Recommencer")}
                                  />
                                </View>
                            )

                      }
                    </View>
                  </View>
                </View>
            )

  }

};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    flexDirection: 'column',
    alignItems: 'stretch'
  },
  logoContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingArea: {
    flex: 6,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loader: {
    width: 250,
    height: 250,
  }
});

export default App;
