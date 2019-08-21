/**
 * @format
 */

import React from 'react';
import {AppRegistry} from 'react-native';
//import App from 'react-native-nfc-manager/example/App'
import App from './App';
import HomePage from './HomePage'
import {name as appName} from './app.json';

const TranslatedApp = () => <App translate={false}/>

AppRegistry.registerComponent(appName, () => TranslatedApp);
