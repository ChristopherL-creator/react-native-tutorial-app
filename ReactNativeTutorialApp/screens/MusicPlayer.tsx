/* eslint-disable no-trailing-spaces */
/* eslint-disable prettier/prettier */
import {View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions, Image, FlatList, Animated} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Slider from '@react-native-community/slider'; 
import songs from '../model/Data';
import TrackPlayer, { Capability, State, Event } from 'react-native-track-player';
import { usePlaybackState, useProgress, useTrackPlayerEvents } from 'react-native-track-player/lib/hooks';

//  to get viewport dimensions;
const {width, height} = Dimensions.get('window'); 

const setupPlayer = async () => {
  try { 
    console.log('songs in setuppllayer', songs);
    
    await TrackPlayer.setupPlayer(); 
    await TrackPlayer.updateOptions({ 
      compactCapabilities: [ 
        Capability.Play, 
        Capability.Pause, 
        Capability.SkipToNext, 
        Capability.SkipToPrevious, 
        Capability.SeekTo, 
        Capability.Stop, 
      ],
      capabilities: [ 
        Capability.Play, 
        Capability.Pause, 
        Capability.SkipToNext, 
        Capability.SkipToPrevious, 
        Capability.SeekTo, 
        Capability.Stop, 
      ],
    }); 
    await TrackPlayer.add(songs); 

  } catch (error) {
    console.log('error', error);
  }
}; 

const togglePlayback = async playbackState => { 
  try {
    console.log('start playbackstate in toggleplayback', playbackState);
    
    const currentTrack = await TrackPlayer.getCurrentTrack(); 
    console.log('currenttrack', currentTrack);
    
    if (currentTrack !== null) {
      if (playbackState !== State.Playing) {
        await TrackPlayer.play(); 
        console.log('onpress playbackstate in toggleplayback', playbackState);
      } else { 
        await TrackPlayer.pause(); 
        console.log('onpress playbackstate in toggleplayback', playbackState);
      } 
      
      console.log('playbackstate end', await TrackPlayer.getState());  
    }
  } catch (error) {
    console.log('error', error);
    
  }
};

const MusicPlayer = () => {  
  const playbackState = usePlaybackState(); 
  console.log('playbackstate in musicplayer', TrackPlayer.getState());
  
  const progress = useProgress(); 
  const [songIndex, setSongIndex] = useState(0);
  
  //  per gestire animazioni;
  const scrollX = useRef(new Animated.Value(0)).current; 
  const songSlider = useRef(null); // flatilist reference 

  //  changing track
  useTrackPlayerEvents([Event.PlaybackTrackChanged],async event => {
    if (event.type === Event.PlaybackTrackChanged && event.nextTrack !== null) {
      const track = await TrackPlayer.getTrack(event.nextTrack);
    } 
  });  

  const skipTo = async trackId => {
    await TrackPlayer.skip(trackId);
  };

  useEffect(() => { 
    try {
      setupPlayer() 
      .then(resp => console.log('response from useeffect setup', resp)) 
      .catch(err => console.log(err)
      );  
      
      scrollX.addListener(({value}) => { 
        // console.log(`ScrollX: ${value} | device width: ${width}`); 
        
        const index = Math.round(value / width); 
        skipTo(index); 
        setSongIndex(index); 
        console.log(index); 
  
        return () => { 
          scrollX.removeAllListeners(); 
        }; 
      });
    } catch (error) {
      console.log('error useffect', error);
      
    }
  }, []);
  
  const skipToPrevious = () => { 
    songSlider.current.scrollToOffset({ 
      offset : (songIndex - 1) * width, 
    }); 
  }; 

  const skipToNext = () => { 
    songSlider.current.scrollToOffset({ 
      offset : (songIndex + 1) * width, 
    }); 
  }; 

  const renderSongs = ({item, index}) => { 
    return ( 
      <Animated.View style={style.mainImageWrapper}> 
        <View style={[style.imageWrapper, style.elevation]}> 
          <Image 
          source={item.artwork} 
          style={style.musicImage}/>
        </View> 
      </Animated.View>

    );
  };

  return ( 
    <SafeAreaView style={style.container}> 
      <View style={style.maincontainer}> 
        
        {/*  
            Animated is needed when usenativedirver
        */}
        <Animated.FlatList 
        ref={songSlider}
        renderItem={renderSongs} 
        data={songs} 
        keyExtractor={item => item.id} 
        horizontal 
        pagingEnabled 
        showsHorizontalScrollIndicator={false} 
        scrollEventThrottle={16} 
        onScroll={Animated.event( 
          [ 
            { 
              nativeEvent: { 
                contentOffset: {x: scrollX},
              },
            },
          ], 
          {useNativeDriver: true},
        )}/>

        <View> 
          <Text style={[style.songContent, style.songTitle]}> 
            {songs[songIndex].title}
          </Text> 
          <Text style={[style.songContent, style.songArtist]}> 
            {songs[songIndex].artist}
          </Text>
        </View> 

        <View> 
          <Slider 
          style={style.progressBar}
          value={progress.position} 
          minimumValue={0} 
          maximumValue={progress.buffered} 
          thumbTintColor="#FFD369"
          minimumTrackTintColor="#FFD369" 
          maximumTrackTintColor="#fff" 
          onSlidingComplete={async value => { 
            await TrackPlayer.seekTo(value);
          }}/> 
          <View style={style.progressLevelDuration}> 
            <Text style={style.progressLabelText}> 
              {new Date(progress.position * 1000) 
              .toLocaleTimeString() 
              .substring(3)}
            </Text> 
            <Text style={style.progressLabelText}> 
              {new Date((progress.duration - progress.position) * 1000) 
              .toLocaleTimeString() 
              .substring(3)}
            </Text>
          </View>
        </View> 

        <View style={style.musicControlsContainer}> 
          <TouchableOpacity onPress={skipToPrevious}> 
            <Ionicons 
            name="play-skip-back-outline" 
            size={35} 
            color="#FFD369"/>
          </TouchableOpacity> 

          <TouchableOpacity onPress={() => togglePlayback(playbackState)}> 
            <Ionicons 
            name={ 
              playbackState === State.Playing 
              ? 'ios-pause-circle' 
              : 'ios-play-circle'
            } 
            size={75} 
            color="#FFD369"/>
          </TouchableOpacity> 

          <TouchableOpacity onPress={skipToNext}> 
            <Ionicons 
            name="play-skip-forward-outline" 
            size={35} 
            color="#FFD369"/>
          </TouchableOpacity> 
        </View>
      </View> 

      <View style={style.bottomContainer}>  
        <View style={style.bottomIconWrapper}> 
          <TouchableOpacity onPress={() => {}}> 
            <Ionicons 
            name="heart-outline" 
            size={30} 
            color="#888"/>
          </TouchableOpacity> 

          <TouchableOpacity onPress={() => {}}> 
            <Ionicons 
            name="repeat" 
            size={30} 
            color="#888"/>
          </TouchableOpacity> 

          <TouchableOpacity onPress={() => {}}> 
            <Ionicons 
            name="share-outline" 
            size={30} 
            color="#888"/>
          </TouchableOpacity> 

          <TouchableOpacity onPress={() => {}}> 
            <Ionicons 
            name="ellipsis-horizontal" 
            size={30} 
            color="#888"/>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MusicPlayer; 

const style = StyleSheet.create({ 
    container: { 
        flex: 1, 
        backgroundColor: '#222831', 
    }, 

    maincontainer: { 
      flex: 1, 
      alignItems: 'center', 
      justifyContent: 'center',
    }, 

    bottomContainer: { 
      width: width, 
      alignItems: 'center', 
      paddingVertical: 15, 
      borderTopColor: '#393E46', 
      borderWidth: 1,
    }, 

    bottomIconWrapper: { 
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      width: '80%',
    }, 

    imageWrapper: { 
      width: 300, 
      height: 340, 
      marginBottom: 20,
      marginTop: 20,
    }, 

    musicImage: { 
      width: '100%', 
      height: '100%', 
      borderRadius: 15,
    }, 

    elevation: { 
      elevation: 5, 
      shadowColor: '#ccc', 
      shadowOffset: { 
        width: 5, 
        height: 5,
      }, 
      shadowOpacity: 0.5, 
      shadowRadius: 3.84,
    }, 

    songTitle: { 
      fontSize: 18, 
      fontWeight: '600', 
    }, 

    songArtist: { 
      fontSize: 16, 
      fontWeight: '300', 
    }, 

    songContent: { 
      textAlign: 'center', 
      color: '#EEE',
    }, 

    progressBar: {
      width: 350, 
      height: 40, 
      marginTop: 20, 
      flexDirection: 'row',
    }, 

    progressLevelDuration: { 
      width: 340, 
      flexDirection: 'row', 
      justifyContent: 'space-between',
    }, 

    progressLabelText: { 
      color: '#fff', 
      fontWeight: '500',
    }, 

    musicControlsContainer: { 
      flexDirection: 'row', 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      width: '60%', 
      marginTop: 10,
    }, 

    mainImageWrapper: { 
      width: width, 
      justifyContent: 'center', 
      alignItems: 'center',
    },
}); 
