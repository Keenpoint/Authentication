import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text, Button, Image,
} from 'react-native';

class ProductCard extends Component {

    render(){
        const { productTitle, sku, handleTemplateModeChange, clearState, t } = this.props
        return (
            <View style={styles.productCard}>
                <View style={{flex: 1}} >
                    <Text style={{textAlign: 'center', fontWeight: '300',fontSize: 22, fontFamily: 'Garamond, Times New Roman, Serif', color: "#bd9455", marginTop: 15}}> {productTitle} </Text>
                    <Image source={require("./img/Terre_d'enfant.png")} resizeMode='contain' style={{height: 150, width: 250, marginTop: 20, marginBottom: 10}}/>
                </View>
                <View style={{flex: 1}} >
                    <Text style={{textAlign: 'center', fontSize: 14}}> { <Text style={{fontWeight: 'bold'}}>REF </Text>} {sku} </Text>
                    <View style={styles.productSnippet}>
                        <View style={styles.snippetBranch}>
                            <Button
                                onPress={clearState}
                                style={{margin: 10}}
                                color='#B1ACAD'
                                title={t("Recommencer")}
                            />
                        </View>
                        <View style={styles.snippetBranch}>
                            <Button
                                onPress={() => handleTemplateModeChange()}
                                style={{margin: 10}}
                                color='#79B4BB'
                                title={t("Voir plus")}
                            />
                        </View>
                    </View>
                    <Text style={{textAlign: 'center', fontWeight: '100', fontSize: 12}}>
                        {t("Certification")}
                    </Text>
                </View>
            </View>
        )

    }

};

const styles = StyleSheet.create({
    productCard: {
        backgroundColor: '#d0e1e3',
        margin: 20,
        padding: 20,
        borderWidth: 1,
        borderRadius: 4,
        borderColor: '#9ab6b9',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    productSnippet: {
        flex: 1,
        flexDirection: 'row'
    },
    snippetBranch: {
        flex: 1,
        flexDirection: 'column',
        padding: 10
    }
});

export default ProductCard;
