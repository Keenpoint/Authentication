import React, {Component} from 'react';
import { StyleSheet, View, Button, TextInput} from 'react-native';


class Login extends Component {

    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: ''
        }
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleSubmit(event) {
        event.preventDefault()

        const {handleSubmit} = this.props
        handleSubmit && handleSubmit(this.state)
    }

    render(){
        return (
            <View>
                <TextInput
                    style={{height: 40}}
                    placeholder="Type Your email"
                    onChangeText={ username => this.setState({username}) }
                    value={this.state.username}
                />
                <TextInput
                    style={{height: 40}}
                    placeholder="Type Your password"
                    onChangeText={ password => this.setState({password}) }
                    value={this.state.password}
                />
                <Button
                    onPress={this.handleSubmit}
                    title="Submit"
                />
            </View>
        )

    }

};

const styles = StyleSheet.create({
    container: {

    }
});

export default Login;
