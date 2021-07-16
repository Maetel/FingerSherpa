import React, { useState } from 'react';
import { Button, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Audio } from 'expo-av';
import AppLoading from 'expo-app-loading';
import Slider from '@react-native-community/slider';

function DetailsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Details!</Text>
    </View>
  );
}

function HomeScreen({ navigation }) {
  const [sound, setSound] = useState();
  const [bpm, setBpm] = useState(120);
  const [volume, setVolume] = useState(80);
  const [intervalId, setIntervalId] = useState();
  const fetchAudio = async () => {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync(
      require('./assets/drum_swing_simple_120_1.wav')
      //require('./assets/drum_swing_complex_120_1.wav')
      //require('./assets/tic2.wav')
    ).catch((err) => {
      console.log(`Failed to fetch audio. Error : ${err}`);
    });
    setSound(sound);
    sound.setIsLoopingAsync(true);
  };

  //Load audio
  if (!sound) {
    return (
      <AppLoading
        startAsync={fetchAudio}
        onFinish={() => {}}
        onError={(err) => {
          console.log(err);
        }}
      ></AppLoading>
    );
  }

  async function playSound() {
    console.log('Playing Sound');
    //await sound.setRateAsync(2.5, true);
    await sound?.playAsync();
  }
  async function replaySound() {
    console.log('Replay sound');
    sound?.replayAsync();
  }
  async function muteSound() {
    console.log('Mute sound');
    sound?.stopAsync();
    if (intervalId) {
      clearInterval(intervalId);
    }
  }

  if (0) {
    setIntervalId(
      setInterval(async () => {
        if (!sound) {
          return;
        }
        try {
          sound?.getStatusAsync().then((status) => {
            console.log(status.isPlaying);
          });
        } catch (error) {
          //console.log(error);
        }
      }, 1000)
    );
  }

  const bpmChangeHandler = async (newBpm) => {
    if (!sound) {
      return;
    }
    setBpm(newBpm);
    await sound?.setRateAsync(newBpm / 120, true);
  };

  const volumeChangeHandler = async (newVolume) => {
    if (!sound) {
      return;
    }
    setVolume(newVolume);
    await sound?.setVolumeAsync(volume / 100).catch((err) => console.log(err));
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />
      <Button title="Play sound" onPress={playSound} />
      <Button title="Stop sound" onPress={muteSound} />
      <Button title="Replay sound" onPress={replaySound} />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text>BPM : {bpm}</Text>
        <Slider
          style={{ width: 200, height: 40 }}
          minimumValue={60}
          step={1}
          value={bpm}
          onValueChange={bpmChangeHandler}
          maximumValue={240}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#000000"
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text>Volume : {volume}</Text>
        <Slider
          style={{ width: 200, height: 40 }}
          step={5}
          value={volume}
          onValueChange={volumeChangeHandler}
          minimumValue={0}
          maximumValue={100}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#000000"
        />
      </View>
    </View>
  );
}

function SettingsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />
    </View>
  );
}

const HomeStack = createStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="Details" component={DetailsScreen} />
    </HomeStack.Navigator>
  );
}

const SettingsStack = createStackNavigator();

function SettingsStackScreen() {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen name="Settings" component={SettingsScreen} />
      <SettingsStack.Screen name="Details" component={DetailsScreen} />
    </SettingsStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeStackScreen} />
        <Tab.Screen name="Settings" component={SettingsStackScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
