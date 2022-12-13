/* eslint-disable no-trailing-spaces */
/* eslint-disable prettier/prettier */
/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json'; 
import TrackPlayer from 'react-native-track-player';

AppRegistry.registerComponent(appName, () => App);  

//  register trackplayer service 
TrackPlayer.registerPlaybackService(() => require('./services/PlaybackService'));
 
