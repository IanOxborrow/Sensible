import React, { Component } from 'react';
import { FloatingAction } from "react-native-floating-action";
import FAB from '../react-native-paper-src/components/FAB/FAB'
import Appbar from '../react-native-paper-src/components/Appbar'
import { SensorType } from '../Sensors';
import Recording from "../Recording";
import App from "../../App";


import {
  StyleSheet,
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  StatusBar
} from 'react-native';

export const recordings_list = [];

const DATA = {
    recordings: [],
};

// Funtion to create each item in the list
function Item({ title, onSelect }) {
    return (
        <View style={styles.listItem} onPress={() => onSelect()}>
            <Text style={styles.listItemText}>{title}</Text>
        </View>
    );
}

export default class HomeScreen extends Component {
    constructor(props){
        super(props);
    }

    render() {
      var recording_number = recordings_list.length;
      //const {recordingInfo} = route.params;
      return (
        <View style={[styles.container, {flexDirection: "column"}]}>

          <Appbar.Header>
            <Appbar.Content title="Sensible" />
          </Appbar.Header>

          <FlatList style={styles.list}
            data={recordings_list}
            renderItem={({item, index}) => (
              <TouchableOpacity onPress={() => null}>
                <View elevation={5} style={styles.listItem}>
                  <Text style={styles.listItemText}> {recordings_list} </Text>
                </View>
              </TouchableOpacity>
            )}
          />

          <FAB
            style={styles.fab}
            icon={require('../assets/baseline_add_black.png')}
            onPress={name => {
              App.recording = new Recording();
              App.recording.addSensor(SensorType.ACCELEROMETER);
              App.recording.addSensor(SensorType.GYROSCOPE);
              App.recording.addSensor(SensorType.MAGNETOMETER);
              App.recording.addSensor(SensorType.BAROMETER);
              App.recording.addSensor(SensorType.MICROPHONE);
              recordings_list.push(recordings_list.length + 1);
              console.log(recordings_list);
              this.props.navigation.navigate("NewRecordingScreen");
            }}
          />
        </View>
      );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF"
  },
  list: {
    flex: 1,
    paddingTop: 10,
  },
  listItem: {
    borderRadius: 5,
    height: 80,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: '#FFFFFF',
    marginTop: '5%',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 2,
      height: 3
    },
    shadowRadius: 5,
    shadowOpacity: 1.0
  },
  listItemText: {
    color: 'black',
    textAlignVertical: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    padding: 10,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 15,
    bottom: 15,
  },
});
