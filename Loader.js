import React, {Component} from 'react';
import {
    StyleSheet,
    View
} from 'react-native';
import LottieView from 'lottie-react-native/src/js/index';

class Loader extends Component {

    componentDidMount() {
        this.animation.play();
    }

    render(){
        return (
            <View style={styles.loader}>
                <View style={styles.loader}>
                    <LottieView
                        ref={animation => {
                            this.animation = animation;
                        }}
                        resizeMode='cover'
                        source={require('./loaders/loading_1')}
                    />
                </View>
            </View>
        )

    }

};

const styles = StyleSheet.create({
    loader: {
        width: 250,
        height: 250,
    }
});

export default Loader;
