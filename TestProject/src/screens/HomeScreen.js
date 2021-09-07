/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import {FloatingAction} from 'react-native-floating-action';
import FAB from '../react-native-paper-src/components/FAB/FAB';
import Appbar from '../react-native-paper-src/components/Appbar';
import {SensorType, toSensorType} from '../Sensors';
import Recording from '../Recording';
import RecordingManager from "../RecordingManager";

import {
    StyleSheet,
    View,
    Text,
    Button,
    FlatList,
    TouchableOpacity,
    StatusBar,
} from 'react-native';

export default class HomeScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            recordings_list: RecordingManager.recordings,
            loading: true
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
                            // TODO: Share all generated files
                            // Share the generated file
                            item.info.shareSensorFile(SensorType.ACCELEROMETER);
                        }}>
                            <View elevation={5} style={styles.listItem}>
                                <Text style={styles.listItemText}> {item.title} </Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />

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
});
