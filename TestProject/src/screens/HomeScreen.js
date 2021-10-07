/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import {FloatingAction} from 'react-native-floating-action';
import FAB from '../react-native-paper-src/components/FAB/FAB';
import Appbar from '../react-native-paper-src/components/Appbar';
import {getSensorClass, SensorInfo, SensorType} from '../Sensors';
import Recording from '../Recording';
import RecordingManager from "../RecordingManager";
import ModalDropdown from 'react-native-modal-dropdown';

import {
    StyleSheet,
    View,
    Text,
    Button,
    FlatList,
    TouchableOpacity,
    StatusBar,
    Modal,
    TouchableWithoutFeedback,
} from 'react-native';

import {
    Accelerometer,
    Barometer,
    GPS,
    Gyroscope,
    Magnetometer
} from "../Sensors";

export default class HomeScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            recordings_list: RecordingManager.recordings,
            availableSensors: [],
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
        await RecordingManager.loadConfig();
        // Request permissions and check whether each sensor is working (this makes it faster for next time)
        for (const sensorId of Object.values(SensorType)) {
            const sensorClass = getSensorClass(sensorId);
            await sensorClass.requestPermissions();
            await sensorClass.isSensorWorking();
        }
        // Load the recordings
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

    render() {
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
                    <TouchableWithoutFeedback onPress={() => {
                        this.setState({modalVisible: false})
                    }}>
                        <View style={styles.modalOverlay}/>
                    </TouchableWithoutFeedback>
                    <View style={styles.parentView}>
                        <View style={styles.modalView}>
                            <ModalDropdown
                                defaultValue={'Press to select the sensor data you want to export'}
                                // TODO: Only show sensors that were active during the recording
                                options={this.state.availableSensors.map(x => SensorInfo[x].name)}
                                style={{alignItems: 'center', alignContent: 'center'}}
                                textStyle={{fontWeight: 'bold', textAlign: 'right'}}
                                dropdownStyle={{width: '70%'}}
                                dropdownTextStyle={{fontWeight: 'bold', textAlign: 'center'}}
                                onSelect={(key) => {
                                    // Share selected sensor file
                                    // TODO: make sure this actually works! (uncomment shareSensorFile)
                                    this.setState({modalVisible: false})
                                    RecordingManager.currentRecording.shareSensorFile(this.state.availableSensors[key])
                                }}/>
                            <FAB
                                style={styles.closeModal}
                                label="Close"
                                onPress={() => {
                                    this.setState({modalVisible: false})
                                }}
                            />
                            <FAB
                                style={styles.deleteModal}
                                label="Delete"
                                onPress={() => {
                                    // TODO: Delete recording data here
                                    const newList = this.state.recordings_list.splice(this.state.activeItem, 1);
                                    this.setState({modalVisible: false, recordings_list: newList})
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
