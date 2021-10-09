/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import FAB from '../react-native-paper-src/components/FAB/FAB';
import Appbar from '../react-native-paper-src/components/Appbar';
import {SensorInfo, getSensorFileName} from '../Sensors';
import Recording from '../Recording';
import RecordingManager from "../RecordingManager";
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
    TouchableWithoutFeedback,
    Alert,
    NativeModules
} from 'react-native';
import sensors from 'react-native-sensors';

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
        };

        // Perform any initialisation required then update the state
        this.init().then(() => this.setState({}));
    }

    /**
     * Perform any initialisation required
     * @return {Promise<void>}
     */
    async init() {
        await RecordingManager.loadRecordings();
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

    render() {

        let sensorRows = this.state.availableSensors.map((id) => {
            return this.sensorRow(SensorInfo[id].name, id);
        })

        return (
            <View style={[styles.container, {flexDirection: 'column'}]}>
                <Appbar.Header>
                    <Appbar.Content title="Sensible"/>
                </Appbar.Header>
                {
                    // Only show whilst recordings are being loaded
                    this.state.loading &&
                    <Text style={{padding: 10}}>Loading recordings...</Text>
                }

                <FlatList
                    style={styles.list}
                    data={this.state.recordings_list}
                    keyExtractor={item => item.id}
                    renderItem={({item}) => (
                        <TouchableOpacity onPress={() => {
                            RecordingManager.currentRecording = item.info;

                            this.setState({
                                modalVisible: true,
                                availableSensors: Object.keys(item.info.enabledSensors).concat(Object.keys(item.info.enabledRecorders)).sort()
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

                            <FAB
                                style={styles.closeModal}
                                label="Close"
                                onPress={() => {
                                    this.setState({modalVisible: false})

                                    // deselect all the selected sensors
                                    for (const [key, value] of Object.entries(this.state.selectedSensors)) {
                                        this.state.selectedSensors[key] = false;
                                    } 
                                }}
                            />
                           <FAB
                                style={styles.closeModal}
                                label="Export"
                                onPress={() => {
                                    this.setState({modalVisible: false})

                                    // delete the contents of the share folder
                                    ofstream.delete(RecordingManager.SAVE_FILE_PATH + "sharing", true);

                                    // write new share folder
                                    ofstream.mkdir(RecordingManager.SAVE_FILE_PATH + "sharing")
                                    


                                    // copy each of the files into the shareing folder
                                    for (const [key, value] of Object.entries(this.state.selectedSensors)) {
                                        
                                        if (this.state.selectedSensors[key] == true) {

                                            var sensorIndex = -1;
                                            for (const [sensorType, sensorInfo] of Object.entries(SensorInfo)) {
                                                if (key == sensorInfo.name) {
                                                    sensorIndex = sensorType
                                                }
                                            }
                                        }

                                        const sensorFileName = getSensorFileName(sensorIndex);
                                        const filePath = RecordingManager.currentRecording.folderPath + sensorFileName;
                                        const sharePath = RecordingManager.SAVE_FILE_PATH + "sharing/" + sensorFileName;

                                        ofstream.copyFile(filePath, sharePath)
                                    }  

                                    console.log(this.state.availableSensors)

                                    // create the zip file with all the contents
                                    const shareFolder = RecordingManager.SAVE_FILE_PATH + "sharing/"
                                    const zipFile = RecordingManager.SAVE_FILE_PATH + RecordingManager.currentRecording.name + ".zip"

                                    zip(shareFolder, zipFile)
                                        .then((path) => {
                                            console.log(`zip completed at ${path}`)
                                        })
                                        .catch((error) => {
                                            console.error(error)
                                        })

                                    // open the share dialogue
                                    Share.open({
                                        url: "file://" + zipFile,
                                        subject: RecordingManager.currentRecording.name,
                                    });


                                    // deselect all the selected sensors
                                    for (const [key, value] of Object.entries(this.state.selectedSensors)) {
                                        this.state.selectedSensors[key] = false;
                                    } 

                                }}
                            />
                            <FAB
                                style={styles.deleteModal}
                                label="Delete"
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

                                                //construct the new recordings file and save it
                                                var newRecordingList = "";
                                                for (var recording of this.state.recordings_list)  {
                                                    console.log("recording" + recording.title + " " + recording.id)
                                                    if (recording.title != RecordingManager.currentRecording.name) {
                                                        newRecordingList = newRecordingList + recording.title + ";" + recording.info.folderPath + "\n";
                                                    }
                                                }

                                                ofstream.writeOnce(RecordingManager.SAVE_FILE_PATH + "recordings.config", false, newRecordingList)

                                                //delete the recording from the file system
                                                const deletePath = RecordingManager.currentRecording.getFolderPath();
                                                ofstream.delete(deletePath, true);
                                                

                                                console.log("setting new list")
                                                const newList = this.state.recordings_list.splice(this.state.activeItem, 1);
                                                this.setState({modalVisible: false, recordings_list: newList})

                                            }},
                                        ],
                                        {
                                        cancelable: false,
                                        onDismiss: () => {}}
                                    );

                                    showAlert();

                                }}
                            />
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
                            RecordingManager.currentRecording = new Recording(
                                'Recording ' + (this.state.recordings_list.length + 1),
                            );
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
        top: -23,
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
});
