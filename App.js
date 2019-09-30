/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react'
import { StyleSheet, View, Text, Image, Button, ImageBackground } from 'react-native'
import ProductCard from './ProductCard'
import Loader from './Loader'
import {startNFC, stopNFC} from "./NFCHelper"
import LanguageSwitcher from './LanguageSwitcher';
import LoginButton from './LoginButton';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      titleMessage: "Rapprocher l'appareil d'un produit",
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
  }

  componentDidMount() {
    startNFC(this.handleNFCTagReading, this.hasStartedNFC)
  }

  componentWillUnmount() {
    stopNFC(this.hasStartedNFC)
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
      titleMessage: this.props.t("Rapprocher l'appareil d'un produit"),
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
                descriptionMessage: this.props.t(jsonResponse.errorMessage)
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
    const { titleMessage, descriptionMessage, tagID, sku, productTitle} = this.state;
    const {t, language, handleLanguageSwitch, toggleModal, userId, setUserSignedOut} = this.props

    return (
        <View style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}>
          <View style={{width: '3%',height:'100%',backgroundColor:'#d0e1e3'}}/>
          <View style={styles.container}>
            <LanguageSwitcher handleLanguageSwitch={handleLanguageSwitch} language={language}/>
            <LoginButton toggleModal={toggleModal} userId={userId} setUserSignedOut={setUserSignedOut}/>
            <View style={styles.logoContainer}>
              <Image source={require('./img/Blason-seul.png')} style={{height: 180, width: 180, backgroundColor: 'transparent', marginTop: 30}}/>
            </View>
            <View style={styles.title}>
              <Text style={{fontSize: 18, color: 'black', fontWeight: '300', fontFamily: 'Garamond, Times New Roman, Serif', marginTop: 30}}>{t("appTitle")}</Text>
            </View>

            <View style={styles.loadingArea}>
              {
                !tagID
                    ? (
                        <View>
                          <Loader/>
                          <Text style={{textAlign: 'center', marginBottom: 40}}> {t(titleMessage)} </Text>
                        </View>
                    )
                    : sku ? (
                        <ProductCard
                            productTitle={productTitle}
                            handleTemplateModeChange={this.handleTemplateModeChange}
                            sku={sku}
                            clearState={() => this.clearState()}
                            t={t}
                        />
                    )
                    : (
                        <View>
                          <Text style={{textAlign: 'center', fontSize: 18, marginBottom: 20}}> {descriptionMessage} </Text>
                          <Text style={{textAlign: 'center', fontSize: 18, marginBottom: 20}}> ID : {tagID} </Text>
                          <Button
                              onPress={() => {
                                this.restart().then(() => this.clearState())
                              }}
                              style={{fontFamily: 'Times New Roman, Serif'}}
                              color='#e94e24'
                              title={t("Recommencer")}
                          />
                          {
                            userId && <Button
                                onPress={() => {
                                  this.restart().then(() => this.clearState())
                                }}
                                style={{fontFamily: 'Times New Roman, Serif'}}
                                color='#e94e24'
                                title={t("registerTag")}
                            />
                          }
                        </View>
                    )
              }
            </View>

          </View>
          <View style={{width: '3%',height:'100%',backgroundColor:'#d0e1e3'}}/>
        </View>
    )

  }

};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#d0e1e3',
    height: '100%',
    width: '75%',
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
