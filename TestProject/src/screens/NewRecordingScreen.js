/* eslint-disable prettier/prettier */
import "react-native-gesture-handler";
import React, { Component, useState, useRef } from "react";
import { FloatingAction } from "react-native-floating-action";
//import DropDownPicker from "react-native-dropdown-picker";
import FAB from "../react-native-paper-src/components/FAB/FAB";
import IconButton from "../react-native-paper-src/components/Button"
import Appbar from '../react-native-paper-src/components/Appbar'
import { SensorType } from "../Sensors";
import CheckBox from 'react-native-check-box'
import { KeyboardAwareFlatList, KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

//TODO reimplement the text inputs with this one to keep the app thematicaly consistant
//import TextInput from '../react-native-paper-src/components/TextInput/TextInput'

import App from "../../App";
import {
    BackHandler,
    StyleSheet,
    View,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    TouchableWithoutFeedback,
    StatusBar,
    FlatList,
    KeyboardAvoidingView,
    Modal
} from "react-native";
import Icon from "react-native-vector-icons"

class NewRecordingScreen extends Component {
    // An object that holds each sensor and it's matching description.
    // Uses the same sensor name as sensorNames. "Measures" section and "Output" section split by "||"
    sensorDescriptions = {
        "accelerometer" : "Measures: Rate of change of velocity (how fast you move the phone)||Output: x per sample rate, representing current velocity (m/s^2).",
        "gyroscope" : "Measures: Orientation and angular velocity (rate of change of movement in each axis)||Output: x, y, z per sample rate, representing each vector's change in velocity (m/s^2).",
        "microphone" : "Measures: Sound, amplitude representing decibels||Output: MP3 file, saved to device.",
    }

    constructor(props) {
        super(props);
        recording_number = props.route.params.recording_number;
        //this.props = props
        this.state = {
            currentSensorSelection: "accelerometer",
            currentSampleRate: "",
            currentLabelAddition: "",
            selectedSensorData: [],
            selectedSensors: [],
            addedLabels: [],
            sensorNames: [{sensorName: "accelerometer", imageSource: require('../assets/accelerometer_icon.png')}, 
                          {sensorName: "gyroscope", imageSource: require('../assets/gyroscope_icon.png')}, 
                          {sensorName: "microphone", imageSource: require('../assets/microphone_icon.png')}],
            sensorSampleRates: { "accelerometer": -1, "gyroscope": -1, "microphone": -1},
            usedSensors: { "accelerometer": false, "gyroscope": false, "microphone": false},
            modalVisible: false,
            currentSensorInfo: "",
        };

        this.usedSensors = { "accelerometer": false, "gyroscope": false, "microphone": false};

        // Ensure the recording class has been initialised
        // TODO: Change this to check whether a `Recording` instance has been passed in
        if (App.recording == null)
        {
            throw new Error("NewRecordingScreen.constructor: App.recording has not been initialised");
        }
    }

    componentDidMount = () => {
        //make sure that the accelorometer is the default item in the picker view
        //this.sensorPicker.selectItem('accelerometer');
    };

    startRecording() {
        for (let i = 0; i < this.state.selectedSensors.length; i++) {
            console.log("Sensor found: " + this.state.selectedSensorData[i]["sensorName"]);
            let sensor;
            switch (this.state.selectedSensorData[i]["sensorName"]) {
                case "microphone":
                    sensor = SensorType.MICROPHONE;
                    break;
                case "accelerometer":
                    sensor = SensorType.ACCELEROMETER;
                    break;
                case "gyroscope":
                    sensor = SensorType.GYROSCOPE;
                    break;
                case "magnetometer":
                    sensor = SensorType.MAGNETOMETER;
                    break;
                case "barometer":
                    sensor = SensorType.BAROMETER;
                    break;
            }

            App.recording.addSensor(sensor);
        }

        this.props.navigation.navigate("RecordingScreen", {
            "sensors": this.state.selectedSensors,
            "labels": this.state.addedLabels,
            recording_number: recording_number,
        });
    }


    sensorRow(item, i) {
        return (
            <View key={i} style={[styles.sensorListItem, {justifyContent: 'space-between'}]}>

                <View style={{flexDirection: "row", alignItems: "center"}}>

                    <TouchableOpacity onPress={() => this.showInfo(item.sensorName)}>
                        <Image source={require('../assets/information_icon.png')} style={[styles.infoButton]}/>
                    </TouchableOpacity>

                    <Image source={item.imageSource} style={[styles.iconButon, {marginEnd: 'auto'}]}/>

                    <Text style={{paddingLeft: 10}}>{item.sensorName.charAt(0).toUpperCase() + item.sensorName.slice(1)}</Text>
                </View>

                <View style={{alignSelf: 'center', flexDirection: "row"}}>
                    <TextInput
                        scrollEnabled={false}
                        placeholder="sample rate"
                        style={{paddingRight: 10}}
                        ref={input => {
                            this.sampleRateInput = input;
                        }}
                        onChangeText={
                            text => {
                                this.state.sensorSampleRates[item.sensorName] = text
                            }
                        }
                    />

                    <CheckBox
                        style={{flexDirection: "row"}}
                        isChecked={this.state.usedSensors[item.sensorName]}
                        onClick={() => {
                            
                            //make sure that a sample rate has been speciified before allowing the check box to be selected
                            if (this.state.sensorSampleRates[item.sensorName] > -1) {

                                //modifiy the state to record that a checkbox has been pressed
                                this.state.usedSensors[item.sensorName] = !this.state.usedSensors[item.sensorName]
                                this.setState(this.state.usedSensors)
                            }

                            //reset the used sensor data array
                            this.state.selectedSensorData = []
                            this.state.selectedSensors = []

                            //itterate over the sensors to see which ones have been selected
                            for (const sensorName in this.state.usedSensors) {

                                // if the sensor is selected add it to the selectedSensorData list
                                if (this.state.usedSensors[sensorName]) {

                                    var newSensor = {
                                        sensorName: sensorName,
                                        sampleRate: this.state.sensorSampleRates[sensorName],
                                    };

                                    this.state.selectedSensorData.push(newSensor);
                                    this.state.selectedSensors.push(sensorName)
                                }
                            }
                        }}
                    />
                </View>
            </View>
        )
    }

    labelListItem = ({ item }) => (
        <View style={styles.labelListItem}>

            <Text>{item.labelName}</Text>

            <TouchableOpacity
                style={{ marginLeft: "auto" }}
                onPress={() => {

                    //remove the selected label from the list
                    for (var i in this.state.addedLabels)
                    {
                        if (item.labelName == this.state.addedLabels[i]["labelName"])
                        {
                            this.state.addedLabels.splice(i, 1);
                            break;
                        }
                    }

                    this.setState({ addedLabels: [...this.state.addedLabels] });

                }}>

                <Image source={require("../assets/baseline_close_black.png")} style={styles.iconButon}  />
            </TouchableOpacity>
        </View>
    );

    //constant item that stays at the bottom of the list. This acts as the add new row in the list
    labelListFooter = () => {
        return (
            <View style={styles.labelListFooter}>

                <TextInput
                    scrollEnabled={false}

                    placeholder="Label Name"
                    styles={{fontSize: 40}}
                    ref={input => {
                        this.labelNameInput = input;
                    }}
                    onChangeText={
                        text => this.setState({ currentLabelAddition: text })
                    } />

                <TouchableOpacity
                    style={{ marginLeft: "auto"}}
                    onPress={() => {

                        //return if a duplicate has been found
                        for (var i in this.state.addedLabels)
                        {
                            if (this.state.addedLabels[i]["labelName"] == this.state.currentLabelAddition)
                            {
                                return;
                            }
                        }

                        //make sure that a value has been entered into the lable name textinput before the button is allowed to be pressed
                        // and make sure that the label name is not in the addedLabels already
                        if (this.state.currentLabelAddition != "")
                        {

                            var newLabel = { labelName: this.state.currentLabelAddition };
                            this.state.addedLabels.push(newLabel);
                            this.setState({ addedLabels: [...this.state.addedLabels] });

                            this.labelNameInput.clear();
                        }
                    }}>

                    <Image source={require("../assets/baseline_add_black.png")} style={styles.iconButon} />
                </TouchableOpacity>
            </View>
        );
    };

    /*  function showInfo()
    *   Created by Ryan Turner
    *   Presents modal to the user, with info on the sensor they just pressed
    *   @param sensor sensor to show info for as string
    */
    showInfo(sensor) {
        this.setState({ modalVisible: true, currentSensorInfo: sensor })
    }

    render() {

        let sensorRows = this.state.sensorNames.map((sensor, i) => {
            return this.sensorRow(sensor, i)
        })


        return (
            <View style={styles.container} >
                <StatusBar barStyle="dark-content" />

                <Appbar.Header>
                    <Appbar.Content title="New Recording Screen" />
                    <Appbar.Action icon={require('../assets/baseline_close_black.png')} onPress={() => this.props.navigation.goBack()}/>
                </Appbar.Header>

                <View style={styles.content}>
                    {sensorRows}

                    <View style={{paddingBottom: 10, fontSize: 20}}>
                        <Text>{"Labels"}</Text>
                    </View>

                    <KeyboardAwareFlatList
                        styles={{flex: 1}}
                        removeClippedSubviews={false}
                        data={this.state.addedLabels}
                        renderItem={this.labelListItem}
                        keyExtractor={item => item.labelName}
                        ListFooterComponent={this.labelListFooter} />
                </View>

                <FAB
                    style={styles.fab}
                    label="Start Recording"
                    onPress={() => {this.startRecording()}}
                />


                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.modalVisible}
                  >
                  <TouchableWithoutFeedback onPress={() => {this.setState({ modalVisible: false })}}>
                    <View style={styles.modalOverlay} />
                  </TouchableWithoutFeedback>

                  <View style={styles.parentView}>
                      <View style={styles.modalView}>
                        <Text style={styles.capitalise}>Sensor: {this.state.currentSensorInfo}</Text>
                        <Text style={styles.sensorDescriptions}>{this.state.currentSensorInfo != "" ? this.sensorDescriptions[this.state.currentSensorInfo].split("||")[0] : ""}</Text>
                        <Text style={styles.sensorDescriptions}>{this.state.currentSensorInfo != "" ? this.sensorDescriptions[this.state.currentSensorInfo].split("||")[1] : ""}</Text>
                        <FAB
                          style={styles.closeModal}
                          label="Close"
                          onPress={() => {this.setState({ modalVisible: false })}}
                        />
                      </View>
                  </View>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 0,
        backgroundColor: "#FFFFFF"
    },
    content: {
        padding: 20,
        marginBottom: 100,
        flex: 1
        //backgroundColor: '#438023'
    },
    heading: {
        padding: 0,
        backgroundColor: "#6200F2",
    },
    headingText: {
        color: "white",
        fontSize: 20,
        padding: 20,
    },
    dropdown: {
        backgroundColor: "#FFFFFF",
    },
    fab: {
        position: "absolute",
        right: 15,
        bottom: 15,
    },
    listComponent: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        padding: 10,
        backgroundColor: "#f4f4f4"

    },
    sensorListItem: {
        flexDirection: "row", 
        alignItems: "center", 
        marginBottom: 10,
    },

    labelListItem: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        marginBottom: 10,
        backgroundColor: "#f4f4f4"
    },
    labelListFooter: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        alignItems: 'stretch',
        backgroundColor: "#f4f4f4"
    },

    iconButon: {
        marginRight: "auto", 
        margin: 5,
        width: 35, 
        height: 35,
    },

    infoButton: {
        marginRight: 15,
        margin: 5,
        width: 25,
        height: 25,
    },

    pickerIcon: {
        width: 24,
        height: 24
    },

    modalView: {
        margin: 30,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 20,
        alignItems: "flex-start",
        shadowColor: "#000000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },

    parentView: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
    },

    capitalise: {
        textTransform: "capitalize",
        paddingBottom: 10,
    },

    sensorDescriptions: {
        paddingBottom: 10,
    },

    closeModal: {
        marginTop: 10,
        alignSelf: 'center'
        //marginLeft: 100,
        //marginRight: 100,
    },

    modalOverlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
});

//export default StackNav

export default NewRecordingScreen;
