import React, {Component} from 'react';
import LoginModal from './LoginModal';
import App from './App'
import { StyleSheet, View } from 'react-native';
import en from './translations/en';
import fr from './translations/fr';


class GlobalApp extends Component {

    constructor(props) {
        super(props);

        this.state = {
            modalVisible: false,
            userId: null,
            language: 'fr'
        };
        this.handleLanguageSwitch = this.handleLanguageSwitch.bind(this)
        this.toggleModal = this.toggleModal.bind(this)
        this.setUserSignedIn = this.setUserSignedIn.bind(this)
        this.setUserSignedOut = this.setUserSignedOut.bind(this)
        this.t = this.t.bind(this)
    }

    toggleModal = (bool) => {
        this.setState({
            modalVisible: bool
        })
    }

    setUserSignedIn(userId) {
        this.setState({
            userId
        })
    }

    setUserSignedOut() {
        this.setState({
            userId: null
        })
    }

    handleLanguageSwitch(language) {
        this.setState({language})
    }

    t(expression) {
        const result = this.state.language === 'fr' ? fr[expression] : en[expression]
        return result || expression
    }

    render(){
        const { modalVisible, userId, language } = this.state;
        return (
            <View style={{ flex: 1 }}>
                <LoginModal modalVisible={modalVisible} toggleModal={this.toggleModal} setUserSignedIn={this.setUserSignedIn} userId={userId}/>
                <App t={this.t} language={language} handleLanguageSwitch={this.handleLanguageSwitch} toggleModal={this.toggleModal} setUserSignedOut={this.setUserSignedOut} userId={userId} />
            </View>
            )

    }

};

const styles = StyleSheet.create({
    container: {

    }
});

export default GlobalApp;
