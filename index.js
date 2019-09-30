/**
 * @format
 */

import React from 'react';
import {AppRegistry} from 'react-native';
//import App from 'react-native-nfc-manager/example/App'
import GlobalApp from './GlobalApp';
import {name as appName} from './app.json';

const TranslatedApp = () => <GlobalApp/>

AppRegistry.registerComponent(appName, () => TranslatedApp);
