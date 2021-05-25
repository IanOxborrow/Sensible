/* eslint-disable prettier/prettier */
import "react-native-gesture-handler";
import React, { Component, useState, useRef } from "react";
import { FloatingAction } from "react-native-floating-action";
import DropDownPicker from "react-native-dropdown-picker";
import FAB from "../react-native-paper-src/components/FAB/FAB";
import IconButton from "../react-native-paper-src/components/Button"
import Appbar from '../react-native-paper-src/components/Appbar'
import Checkbox from '../react-native-paper-src/components/Checkbox'
import { KeyboardAwareFlatList, KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { KeyboardAwareView } from 'react-native-keyboard-aware-view'
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
    StatusBar,
    FlatList,
    KeyboardAvoidingView
} from "react-native";
import Icon from "react-native-vector-icons"

class NewRecordingScreen extends Component {

    constructor(props) {
        super(props);
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
            usedSensors: { "accelerometer": false, "gyroscope": false, "microphone": false}
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

    sensorRow(item, i) {
        return (
            <View key={i} style={[styles.sensorListItem, {justifyContent: 'space-between'}]}>
            
                <View style={{alignSelf: 'flex-start', flexDirection: "row", alignItems: "center"}}>

                    <Image source={item.imageSource} style={[styles.iconButon, {marginEnd: 'auto'}]}/>

                    <Text style={{paddingLeft: 24}}>{item.sensorName.charAt(0).toUpperCase() + item.sensorName.slice(1)}</Text>

                </View>

                <View style={{alignSelf: 'flex-end', flexDirection: "row", alignItems: "center"}}>
                    <TextInput
                        placeholder="sample rate"
                        style={{paddingRight: 24}}
                        ref={input => {
                            this.sampleRateInput = input;
                        }}
                        onChangeText={
                            text => {
                                this.state.sensorSampleRates[item.sensorName] = text
                            }
                        }
                    />

                    <Checkbox
                        status={this.state.usedSensors[item.sensorName] ? 'checked' : 'unchecked'}
                        onPress={() => {
                            
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
                    console.log("waspressed" + item.labelName);
                    //use the label name to identify which row was pressed to work out which data to remove

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

                <KeyboardAwareScrollView>
                    <View style={styles.content}>
                        {sensorRows}

                        <View style={{paddingBottom: 10, fontSize: 20}}>
                            <Text>{"Labels"}</Text>
                        </View>

                        <FlatList
                            data={this.state.addedLabels}
                            renderItem={this.labelListItem}
                            keyExtractor={item => item.labelName}
                            ListFooterComponent={this.labelListFooter} />

                    </View>
                </KeyboardAwareScrollView>  

                <FAB
                        style={styles.fab}
                        label="Start Recording"
                        onPress={name => {
                            this.props.navigation.navigate("RecordingScreen", {
                                "sensors": this.state.selectedSensors,
                                "labels": this.state.addedLabels,
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
        padding: 0,
        backgroundColor: "#FFFFFF"
    },
    content: {
        
        padding: 20,
        marginBottom: 100,
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
        margin: 16,
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
        height: 35
    },

    pickerIcon: { 
        width: 24, 
        height: 24
    }


});

//export default StackNav

export default NewRecordingScreen;
