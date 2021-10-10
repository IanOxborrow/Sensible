/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import FAB from '../react-native-paper-src/components/FAB/FAB';
import Appbar from '../react-native-paper-src/components/Appbar';
import PaperButton from "../react-native-paper-src/components/Button";
import {getSensorClass, getSensorFileName, SensorInfo, SensorType} from '../Sensors';
import Recording from '../Recording';
import RecordingManager from "../RecordingManager";
import ModalDropdown from 'react-native-modal-dropdown';
import Share from 'react-native-share';

import CheckBox from 'react-native-check-box';
import { zip } from 'react-native-zip-archive'
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Modal,
    Platform,
    TouchableWithoutFeedback,
    Alert,
    NativeModules,
    Image,
    TouchableWithFeedback,
} from 'react-native';
const { ofstream } = NativeModules;

export default class HomeScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            recordings_list: RecordingManager.recordings,
            availableSensors: [],
            selectedSensors: {},
            loading: true,
            modalVisible: false,
            activeItem: 0,
            selectedRecording: null,
            helpShown: false,
        };

        // Perform any initialisation required then update the state
        this.init().then(() => this.setState({}));
    }

    /**
     * Perform any initialisation required
     * @return {Promise<void>}
     */
    async init() {
        console.log("1")
        await RecordingManager.loadConfig();
        // Request permissions and check whether each sensor is working (this makes it faster for next time)
        for (const sensorId of Object.values(SensorType)) {
            const sensorClass = getSensorClass(sensorId);
            console.log(sensorId + "a")
            await sensorClass.requestPermissions();
            console.log(sensorId + "b")
            await sensorClass.isSensorWorking();
        }
        console.log("2")
        // Load the recordings
        await RecordingManager.loadRecordings();
        console.log("3")
        this.state.loading = false;
    }

    static getDerivedStateFromProps(props, state) {
        // Add the new recording (after finishing the recording)
        if (props && props.route && props.route.params && props.route.params.complete) {
            state.recordings_list.push({
                title: RecordingManager.currentRecording.name,
                id: state.recordings_list.length + 1,
                info: RecordingManager.currentRecording,
            });
            props.route.params.complete = false;
        }
        // Update nothing
        return null;
    }

    // returns a row for each sensor. It is used in the modal
    sensorRow(name, sensorID) {

        return (
            <View key={sensorID} style={{flexDirection: "row", alignItems: "center", justifyContent: 'flex-end'}}>

                <Text style={{paddingLeft: 10}}>{name}</Text>

                <CheckBox
                    isChecked={this.state.selectedSensors[name]}
                    onClick={async () => {

                        //modifiy the state to record that a checkbox has been pressed
                        this.state.selectedSensors[name] = !this.state.selectedSensors[name]
                        this.setState(this.state.selectedSensors)
                    }}
                />
            </View>
        )
    }

    showAlert() {
        return Alert.alert(
            "Alert Title",
            "My Alert Msg",
            [
            {
                text: "Cancel",
                onPress: () => Alert.alert("Cancel Pressed"),
                style: "cancel",
            },
            ],
            {
            cancelable: true,
            onDismiss: () =>
                Alert.alert(
                "This alert was dismissed by tapping outside of the alert dialog."
                ),
            }
        );
    }

    // returns a row for each sensor. It is used in the modal
    sensorRow(name, sensorID) {

        return (
            <View key={sensorID} style={{flexDirection: "row", alignItems: "center", justifyContent: 'flex-end'}}>

                <Text style={{paddingLeft: 10}}>{name}</Text>

                <CheckBox
                    isChecked={this.state.selectedSensors[sensorID]}
                    onClick={async () => {

                        //modifiy the state to record that a checkbox has been pressed
                        this.state.selectedSensors[sensorID] = !this.state.selectedSensors[sensorID]
                        this.setState(this.state.selectedSensors)
                    }}
                />
            </View>
        )
    }

    showAlert() {
        return Alert.alert(
            "Alert Title",
            "My Alert Msg",
            [
            {
                text: "Cancel",
                onPress: () => Alert.alert("Cancel Pressed"),
                style: "cancel",
            },
            ],
            {
            cancelable: true,
            onDismiss: () =>
                Alert.alert(
                "This alert was dismissed by tapping outside of the alert dialog."
                ),
            }
        );
    }

    render() {

        console.log(RecordingManager.SAVE_FILE_PATH)

        let sensorRows = this.state.availableSensors.map((id) => {
            return this.sensorRow(SensorInfo[id].name, id);
        })

        return (
            <View style={[styles.container, {flexDirection: 'column'}]}>
                <Appbar.Header>
                    <Appbar.Content title="Sensible"/>
                    <Appbar.Action style={[styles.helpIcon]} size={35} icon={require("../assets/help_icon.png")}
                                                        onPress={() => {this.setState({helpShown: true})}}/>
                </Appbar.Header>
                {
                    // Only show whilst recordings are being loaded
                    this.state.loading &&
                    <Text style={{padding: 10}}>Loading recordings...</Text>
                }

                {this.state.recordings_list.length == 0 ? <Text style={styles.infoText}>No recordings found</Text> : <Text></Text>}

                <FlatList
                    style={styles.list}
                    data={this.state.recordings_list}
                    keyExtractor={item => item.id}
                    renderItem={({item}) => (
                        <TouchableOpacity onPress={() => {
                            RecordingManager.currentRecording = item.info;

                            this.setState({
                                modalVisible: true,
                                availableSensors: Object.keys(item.info.enabledSensors).concat(Object.keys(item.info.enabledRecorders)).sort(),
                                selectedRecording: item
                            })
                        }}>
                            <View elevation={5} style={styles.listItem}>
                                <Text style={styles.listItemText}> {item.title} </Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />

                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.modalVisible}>
                    <TouchableWithoutFeedback onPress={() => {this.setState({modalVisible: false})}}>
                        <View style={styles.modalOverlay}/>
                    </TouchableWithoutFeedback>

                    <View style={styles.parentView}>
                        <View style={styles.modalView}>

                            {sensorRows}
                            {this.sensorRow("Labels", -1)}
                            {this.sensorRow("Metadata", -2)}

                            <PaperButton
                                style={styles.closeModal}
                                mode="contained"
                                onPress={() => {
                                    this.setState({modalVisible: false})

                                    // deselect all the selected sensors
                                    for (const [key, value] of Object.entries(this.state.selectedSensors)) {
                                        this.state.selectedSensors[key] = false;
                                    }
                                }}
                            >Close</PaperButton>
                           <PaperButton
                                style={styles.closeModal}
                                mode="contained"
                                label="Export"
                                onPress={async () => {
                                    this.setState({modalVisible: false})

                                    console.log("is here 1")

                                    const directoryExists = await ofstream.directoryExists(RecordingManager.SAVE_FILE_PATH + "sharing");

                                    console.log("is here 2")
                                    if (directoryExists) {
                                        // delete the contents of the share folder
                                        await ofstream.delete(RecordingManager.SAVE_FILE_PATH + "sharing", true);
                                    }


                                    console.log("is here 2.5 " + directoryExists)

                                    if (!directoryExists) {
                                        // write new share folder
                                        await ofstream.mkdir(RecordingManager.SAVE_FILE_PATH + "sharing")
                                    }

                                    console.log("is here 3")

                                    // copy each of the files into the sharing folder
                                    for (const [sensorId, value] of Object.entries(this.state.selectedSensors)) {
                                        if (value) {
                                            let filePath = RecordingManager.currentRecording.folderPath;
                                            let sharePath = RecordingManager.SAVE_FILE_PATH + "sharing/";
                                            // Export the sensor files
                                            if (SensorInfo[sensorId]) {
                                                const sensorFileName = getSensorFileName(sensorId);
                                                filePath += sensorFileName;
                                                sharePath += sensorFileName;
                                            }
                                            // Export the labels
                                            else if (sensorId == -1) {
                                                filePath += "labels.csv";
                                                sharePath += "labels.csv";
                                            }
                                            // Export the metadata
                                            else if (sensorId == -2) {
                                                filePath += "info.json";
                                                sharePath += "info.json";
                                            }
                                            await ofstream.copyFile(filePath, sharePath);
                                        }
                                    }

                                    // create the zip file with all the contents
                                    const shareFolder = RecordingManager.SAVE_FILE_PATH + "sharing/"
                                    const zipFile = RecordingManager.SAVE_FILE_PATH + RecordingManager.currentRecording.name + ".zip"

                                    await zip(shareFolder, zipFile)
                                    .then((path) => {
                                        console.log(`zip completed at ${path}`)
                                    })
                                    .catch((error) => {
                                        console.error(error)
                                    })

                                    console.log("is here 4")

                                    //const shareResponse = await Share.open(options);
                                    // open the share dialogue
                                    await Share.open({
                                        url: "file://" + zipFile,
                                        subject: RecordingManager.currentRecording.name,
                                    }).then((res) => {
                                        console.log(res);
                                    })
                                    .catch((err) => {
                                        console.log(err);
                                    });

                                    console.log("is here 5")

                                    await ofstream.delete(zipFile, false)

                                    console.log("is here 6")
                                    // deselect all the selected sensors
                                    for (const [key, value] of Object.entries(this.state.selectedSensors)) {
                                        this.state.selectedSensors[key] = false;
                                    }

                                }}
                            >Export</PaperButton>
                            <PaperButton
                                style={styles.deleteModal}
                                mode="contained"
                                onPress={() => {

                                    const showAlert = () =>
                                    Alert.alert(
                                        "Delete this recording?",
                                        "This will delete all files ascociated with this recording",
                                        [
                                            {text: 'Cancel', onPress: () => {}},
                                            {text: 'Delete', onPress: () => {
                                                // deselect all the selected sensors
                                                for (const [key, value] of Object.entries(this.state.selectedSensors)) {
                                                    this.state.selectedSensors[key] = false;
                                                }
                                                RecordingManager.usedRecordingIds.delete(this.state.selectedRecording.id);

                                                //construct the new recordings file and save it
                                                let newRecordingList = "";
                                                let recordingIdx;
                                                for (let i = 0; i < RecordingManager.recordings.length; i++)  {
                                                    const recording = RecordingManager.recordings[i];
                                                    if (recording.id != this.state.selectedRecording.id) {
                                                        newRecordingList = newRecordingList + recording.title + ";" + recording.info.folderPath + "\n";
                                                    }
                                                    else {
                                                        recordingIdx = i;
                                                    }
                                                }

                                                ofstream.writeOnce(RecordingManager.SAVE_FILE_PATH + "recordings.config", false, newRecordingList)

                                                //delete the recording from the file system
                                                const deletePath = RecordingManager.currentRecording.folderPath;
                                                ofstream.delete(deletePath, true);


                                                RecordingManager.recordings.splice(recordingIdx, 1);
                                                this.setState({modalVisible: false})

                                            }},
                                        ],
                                        {
                                        cancelable: false,
                                        onDismiss: () => {}}
                                    );

                                    showAlert();

                                }}
                            >Delete</PaperButton>
                        </View>
                    </View>

                </Modal>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.helpShown}>
                    <TouchableWithoutFeedback onPress={() => {
                        this.setState({helpShown: false})
                    }}>
                        <View style={styles.modalOverlay}/>
                    </TouchableWithoutFeedback>

                    <View style={styles.parentView}>
                        <View style={styles.modalView}>
                            <Text>A tutorial video can be found here: link</Text>
                            <PaperButton
                                style={{marginTop: 10}}
                                mode="contained"
                                onPress={() => {
                                    this.setState({helpShown: false})
                                }}
                            >Close</PaperButton>
                        </View>
                    </View>
                </Modal>

                {
                    // Only show once the recordings have been loaded
                    !this.state.loading &&
                    <FAB
                        style={styles.fab}
                        icon={require('../assets/baseline_add_black.png')}
                        onPress={name => {
                            RecordingManager.currentRecording = new Recording();
                            this.props.navigation.navigate('NewRecordingScreen', {
                                recording_number: this.state.recordings_list.length,
                            });
                        }}
                    />
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
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
            height: 3,
        },
        shadowRadius: 5,
        shadowOpacity: 1.0,
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
        color: '#FFFFFF',
        margin: 16,
        right: 15,
        bottom: 15,
    },
    modalView: {
        margin: 30,
        backgroundColor: "white",
        borderRadius: 20,
        width: "70%",
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
    closeModal: {
        position: 'relative',
        top: 25,
        marginTop: 10,
        alignSelf: 'flex-start'
    },
    deleteModal: {
        position: 'relative',
        top: -12,
        marginTop: 0,
        alignSelf: 'flex-end'
    },
    modalOverlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    infoText: {
        position: 'relative',
        textAlign: 'center',
        marginTop: 30,
    },
});
