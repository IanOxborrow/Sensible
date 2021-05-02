/* eslint-disable prettier/prettier */
import "react-native-gesture-handler";
import React, { Component, useState, useRef } from "react";
import { FloatingAction } from "react-native-floating-action";
import DropDownPicker from "react-native-dropdown-picker";
import FAB from "../react-native-paper-src/components/FAB/FAB";
import IconButton from "../react-native-paper-src/components/Button"
import Appbar from '../react-native-paper-src/components/Appbar'


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
} from "react-native";
import Icon from "react-native-vector-icons"

class NewRecordingScreen extends Component
{

    constructor(props)
    {
        super(props);
        //this.props = props
        this.state = {
            currentSensorSelection: "acceleromoter",
            currentSampleRate: "",
            currentLabelAddition: "",
            selectedSensorData: [],
            selectedSensors: [],
            addedLabels: [],
        };

        this.sensorPicker;

        this.usedSensors = { "acceleromoter": false, "gyroscope": false, "microphone": false };

        // Ensure the recording class has been initialised
        if (App.recording == null)
        {
            throw new Error("NewRecordingScreen.constructor: App.recording has not been initialised");
        }
    }

    componentDidMount = () => {
        //make sure that the accelorometer is the default item in the picker view
        //this.sensorPicker.selectItem('acceleromoter');
    };

    sensorListHeader = () => {

    };

    sensorListItem = ({ item }) => (
        <View style={styles.sensorListItem}>
            <DropDownPicker
                items={[
                    { label: item.sensorName.charAt(0).toUpperCase() + item.sensorName.slice(1), value: item.sensorName }
                    /*    icon: () => <Image source={require("../assets/" + item.sensorName + "_icon.png")} style={styles.pickerIcon} /> }*/
                    /*{label: 'Acceleromoter', value: 'acceleromoter', icon: () => <Icon name="flag" size={18} color="#900" />, hidden: true},
                    {label: 'Gyroscope', value: 'gyroscope', icon: () => <Icon name="flag" size={18} color="#900" />},
                    {label: 'Microphone', value: 'microphone', icon: () => <Icon name="flag" size={18} color="#900" />},*/
                ]}
                defaultValue={item.sensorName}
                containerStyle={{ height: 40, width: 150, backgroundColor: "#FFFFFF" }}
                style={styles.dropdown}
                itemStyle={{
                    justifyContent: "flex-start",
                    backgroundColor: "#FFFFFF",
                }}
                dropDownStyle={{ backgroundColor: "#FFFFFF"}}

                />
            <View style={[styles.listComponent, {marginLeft: 20}]}>

                <Text>{item.sampleRate}</Text>

                <TouchableOpacity
                    style={{ marginLeft: "auto" }}
                    onPress={() => {
                        console.log("waspressed" + item.sensorName);
                        //use the sensor name to identify which row was pressed to work out which data to remove

                        //make the sensor as not being used
                        this.usedSensors[item.sensorName] = false;

                        //remove the sensor from the sensordata array
                        for (var i in this.state.selectedSensorData)
                        {
                            var sensorData = this.state.selectedSensorData[i];
                            if (item.sensorName == sensorData["sensorName"])
                            {
                                this.state.selectedSensorData.splice(i, 1);
                                break;
                            }
                        }

                        //update the listview
                        this.setState({ selectedSensors: [...this.state.selectedSensorData] });

                        //set the new default vaule to be the first non hidden value
                        for (key in this.usedSensors)
                        {
                            if (!this.usedSensors[key])
                            {
                                this.sensorPicker.selectItem(key);
                                break;
                            }

                            //if all the sensors have been selected, set the curret selection to the 'empty' value
                            this.sensorPicker.selectItem("empty");
                        }

                    }}>

                    <Image source={require("../assets/baseline_close_black.png")} style={styles.iconButon}  />
                </TouchableOpacity>
            </View>
        </View>
    );

    //constant item that stays at the bottom of the list. This acts as the add new row in the list
    sensorListFooter = () => {
        return (
            <View style={styles.sensorListFooter} >
                <DropDownPicker
                    ref={this.sensorPickerRef}
                    items={[
                        { label: "Acceleromoter", value: "acceleromoter", hidden: this.usedSensors["acceleromoter"], 
                            icon:  () => <Image source={require("../assets/acceleromotor_icon.png")} style={styles.pickerIcon} />},
                        { label: "Gyroscope", value: "gyroscope", hidden: this.usedSensors["gyroscope"], 
                        icon:  () => <Image source={require("../assets/gyroscope_icon.png")} style={styles.pickerIcon} /> },
                        { label: "Microphone", value: "microphone", hidden: this.usedSensors["microphone"], 
                        icon:  () => <Image source={require("../assets/microphone_icon.png")} style={styles.pickerIcon} /> },
                        { label: "", value: "empty", hidden: true },
                        /*{label: 'Acceleromoter', value: 'acceleromoter', icon: () => <Icon name="flag" size={18} color="#900" />, hidden: true},
                        {label: 'Gyroscope', value: 'gyroscope', icon: () => <Icon name="flag" size={18} color="#900" />},
                        {label: 'Microphone', value: 'microphone', icon: () => <Icon name="flag" size={18} color="#900" />},*/
                    ]}
                    defaultValue={"acceleromoter"}
                    controller={instance => this.sensorPicker = instance}

                    containerStyle={{ height: 40, width: 180, backgroundColor: "#FFFFFF" }}
                    style={styles.dropdown}
                    itemStyle={{
                        justifyContent: "flex-start",
                        backgroundColor: "#FFFFFF",
                    }}
                    dropDownStyle={{ backgroundColor: "#FFFFFF"}}

                    onChangeItem={
                        item => this.setState({ currentSensorSelection: item.value })
                    }
                />
                <View style={[styles.listComponent, {marginLeft: 20}]}>
                    <TextInput
                        placeholder="sample rate"
                        style={{}}
                        ref={input => {
                            this.sampleRateInput = input;
                        }}
                        onChangeText={
                            text => this.setState({ currentSampleRate: text })
                        }
                    />

                    <TouchableOpacity
                        style={{ marginLeft: "auto" }}
                        onPress={() => {

                            //make sure that a value has been entered into the lable name textinput before the button is allowed to be pressed
                            if (this.state.currentSensorSelection != "empty" && this.state.currentSampleRate != "")
                            {
                                newSensor = {
                                    sensorName: this.state.currentSensorSelection,
                                    sampleRate: this.state.currentSampleRate,
                                };

                                //add the selected sensor to a dictioany to mark that it has been selected
                                this.usedSensors[this.state.currentSensorSelection] = true;

                                this.state.selectedSensorData.push(newSensor);
                                this.setState({ selectedSensors: [...this.state.selectedSensorData] });

                                //set the new default vaule to be the first non hidden value
                                for (key in this.usedSensors)
                                {
                                    if (!this.usedSensors[key])
                                    {
                                        this.sensorPicker.selectItem(key);
                                        break;
                                    }

                                    //if all the sensors have been selected, set the curret selection to the 'empty' value
                                    this.sensorPicker.selectItem("empty");
                                }

                                this.sampleRateInput.clear();
                            }
                        }} >
                        <Image source={require("../assets/baseline_add_black.png") } style={styles.iconButon}  />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

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
                        for (i in this.state.addedLabels)
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

                            newLabel = { labelName: this.state.currentLabelAddition };
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

    render()
    {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="dark-content" />

                <Appbar.Header>
                    <Appbar.BackAction onPress={{}} />
                    <Appbar.Content title="New Recording Screen" />
                </Appbar.Header>

                <View style={styles.content}>

                    
                    <View style={{ flexDirection: "row", paddingBottom: 10 }}>
                        <Text>{"Sensors"}</Text>
                        <Text>{"Sample Rate"}</Text>
                    </View>

                    <FlatList
                        data={this.state.selectedSensors}
                        renderItem={this.sensorListItem}
                        keyExtractor={item => item.sensorName}
                        ListFooterComponent={this.sensorListFooter} />

                    <View style={{paddingBottom: 10}}>
                        <Text>{"Labels"}</Text>
                    </View>

                    <FlatList
                        data={this.state.addedLabels}
                        renderItem={this.labelListItem}
                        keyExtractor={item => item.labelName}
                        ListFooterComponent={this.labelListFooter} />

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
        flex: 1,
        padding: 20
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
        flex: 1,
        flexDirection: "row", 
        alignItems: "center", 
        marginBottom: 10,
    },
    sensorListFooter: {
        flex: 1,
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
        marginLeft: "auto", 
        margin: 5,
        width: 30, 
        height: 30
    },

    pickerIcon: { 
        width: 24, 
        height: 24
    }
    
});

//export default StackNav

export default NewRecordingScreen;
