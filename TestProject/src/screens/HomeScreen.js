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

        this.state = {
            recordings_list: [],
        }
    }

    render() {
      var recording_number = this.state.recordings_list.length;
      //const {recordingInfo} = route.params;
      return (
        <View style={[styles.container, {flexDirection: "column"}]}>

          <Appbar.Header>
            <Appbar.Content title="Sensible" />
          </Appbar.Header>

          <FlatList style={styles.list}
            data={this.state.recordings_list}
            keyExtractor={(item) => item.id}
            renderItem={({item}) => (
              <TouchableOpacity onPress={() => console.log(item.info)}>
                <View elevation={5} style={styles.listItem}>
                  <Text style={styles.listItemText}> {item.title} </Text>
                </View>
              </TouchableOpacity>
            )}
          />

          <FAB
            style={styles.fab}
            icon={require('../assets/baseline_add_black.png')}
            onPress={name => {
              App.recording = new Recording();
              App.recording.name = "Recording " + (this.state.recordings_list.length+1);
              App.recording.addSensor(SensorType.ACCELEROMETER);
              App.recording.addSensor(SensorType.GYROSCOPE);
              App.recording.addSensor(SensorType.MAGNETOMETER);
              App.recording.addSensor(SensorType.BAROMETER);
              App.recording.addSensor(SensorType.MICROPHONE);
              this.state.recordings_list.push({title: App.recording.name, id: this.state.recordings_list.length+1, info: App.recording});
              console.log(this.state.recordings_list);
              this.setState({});
              this.props.navigation.navigate("NewRecordingScreen", {
                "recording_number": this.state.recordings_list.length,
              });
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