import React, {Component} from 'react';
import Login from './Login'
import { StyleSheet, View, Text} from 'react-native';

const myInit = {
    method: 'POST',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
    credentials: 'same-origin'
}


class LoginController extends Component {

    constructor(props) {
        super(props);

        this.state = {
            error: null
        };

        this.handleSubmit = this.handleSubmit.bind(this)
        this.clearError = this.clearError.bind(this)
    }

    clearError() {
        this.setState({error: null})
    }

    handleSubmit(user) {

        const { toggleModal, setUserSignedIn } = this.props;

        return fetch('http://172.20.0.23:9003/login',{
            ...myInit,
            body: JSON.stringify(user),
        })
            .then(response => response.json())
            .then(responseJson => {
                if(responseJson.error) {
                    this.setState({error})
                } else {
                    setUserSignedIn(responseJson.id)
                    toggleModal(false)
                }

            })
            .catch(error => this.setState({error}))
    }

    render(){
        const { userId } = this.props
        const { error } = this.state;
        return (
            <View>
                { !userId
                    ? <Login handleSubmit={this.handleSubmit} clearError={this.clearError} error={error}/>
                    : <Text> user with id {userId} connected</Text>
                }
            </View>
        )

    }

};

const styles = StyleSheet.create({
    container: {

    }
});

export default LoginController;
