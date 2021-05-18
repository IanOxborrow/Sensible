/* eslint-disable prettier/prettier */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import App from '../../App';
import { SensorType } from '../Sensors';
import {LineChart} from 'react-native-chart-kit';
import Appbar from '../react-native-paper-src/components/Appbar'
import ToggleButton from '../react-native-paper-src/components/ToggleButton'
import Toast, {DURATION} from 'react-native-easy-toast'

import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    Button,
    FlatList,
    TouchableOpacity,
} from 'react-native';

const data = {
    labels: [],
    datasets: [
        {
            data: [],
        },
    ],
};

const chartConfig = {
    backgroundColor: '#e26a00',
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
};


class RecordingScreen extends Component
{

    constructor(props)
    {
        super(props);

        sensors = props.route.params.sensors;
        labels = props.route.params.labels;
        console.log(props.route.params.sensors);
        console.log(props.route.params.labels);


        this.state = {
            startTime: new Date(),
            lastUpdateTime: new Date(),
            dataSource: [0],
            labelSource: ['0'],
            currentLabel: null,
            sensors: props.route.params.sensors,
            labels: props.route.params.labels,
            sensorNames: [],
            checkedStatus: [],
            currentSensor: ""
        };

        for (const [key, value] of Object.entries(this.state.sensors)) {
            console.log("loopy", key, value);
            this.state.sensorNames.push(value['sensorName'])
            this.state.checkedStatus[value['sensorName']] = 'unchecked'
            //this.state.checkedStatus.push({key: value['sensorName'], value: false})
        }

        console.log(this.state.sensorNames[0])
        console.log(this.state.checkedStatus)
        console.log(this.state.checkedStatus[this.state.sensorNames[0]])
        //set the checked status of the first sensor to be true
        this.state.checkedStatus[this.state.sensorNames[0]] = 'checked'

        console.log(this.state.checkedStatus[this.state.sensorNames[0]])

        this.state.currentSensor = this.state.sensorNames[0]

        console.log('default sensor ' + this.state.currentSensor)

        // Ensure the recording class has been initialised
        if (App.recording == null)
        {
            throw new Error('NewRecordingScreen.constructor: App.recording has not been initialised');
        }
    }

    // Funtion to create each item in the list
    Item({ title, onSelect })
    {
        return (
            <View style={styles.listItem} onPress={() => onSelect()}>
                <Text style={styles.listItemText}>{title}</Text>
            </View>
        );
    }

    setLabel(label)
    {
        let newLabel = null;
        // Update the label if a different button is pressed
        if (label.labelName !== this.state.currentLabel)
        {
            newLabel = label.labelName;
        }
        // Update the label
        App.recording.setLabel(newLabel);
        this.state.currentLabel = newLabel;
        // Output a debug message
        console.log(newLabel == null ? "Cleared " + label.labelName + " label" : "Set label to " + newLabel);
    }

    //function changeDisplayedOnGraph()

    toggleGraphDisplay(pressedButtonName) {

        this.state.currentSensor = pressedButtonName
        this.state.checkedStatus[pressedButtonName] = 'checked';

        //this.state.dataSource = [0]

        // TODO next sprint: This can be optimised to simply uncheck the last button and check the new button
        for (const [key, value] of Object.entries(this.state.checkedStatus)) {

            if (key != pressedButtonName)
                this.state.checkedStatus[key] = 'unchecked'
        }

    }

    // Displays a toast when a button is long pressed
    displayToast(buttonName) {
        // Making the toast (delicious)
        this.toast.show('Sensor: ' + buttonName, 2000);
    }

    render() {

        const updateGraphData = () => {
            let maxPoints = 20;
            // Add a new point
            var sample = null

            switch (this.state.currentSensor) {
                case "microphone":
                    sample = App.recording.getSensorData(SensorType.MICROPHONE).getLatestSample();
                    break
                case "accelerometer":
                    sample = App.recording.getSensorData(SensorType.ACCELEROMETER).getLatestSample();
                    break
                case "gyroscope":
                    sample = App.recording.getSensorData(SensorType.GYROSCOPE).getLatestSample();
                    break
                case "magnetometer":
                    sample = App.recording.getSensorData(SensorType.MAGNETOMETER).getLatestSample();
                    break
                case "barometer":
                    sample = App.recording.getSensorData(SensorType.BAROMETER).getLatestSample();
                    break
                
            }

            if (sample == null)
            {
                throw new Error("RecordingScreen.render: Attempted to get samples from current sensor but no data was found");
            }

            // TODO: Use data from `this.state` and the `getData()` function of each sample to create n axis
            this.state.dataSource.push(sample.x); // TODO: Figure out how to display 3 axis
            //this.state.dataSource.push(sample);
            // Add the corresponding x-value
            let timeElapsed = (new Date() - this.state.lastUpdateTime) / 1000;
            if (timeElapsed >= 1)
            {
                this.state.lastUpdateTime = new Date();
                let label = Math.round((new Date() - this.state.startTime) / 1000);
                this.state.labelSource.push(label.toString());
            }
            else
            {
                this.state.labelSource.push('');
            }

            // Remove the first point (from the front)
            if (this.state.dataSource.length > maxPoints)
            {
                this.state.dataSource.shift();
                this.state.labelSource.shift();
            }

            // Update the counter (MAY BE REDUNDANT)
            this.state.counter++;
        };

        const updateGraphUI = () => {
            this.forceUpdate();
        };

        // these get called with every update
        updateGraphData();
        setTimeout(updateGraphUI, 200); // call render again at the specified interval

        data.datasets[0].data = this.state.dataSource.map(value => value);
        data.labels = this.state.labelSource.map(value => value);

        //console.log("names " + this.state.sensorNames)

        let iconDictionary = {

            'accelerometer': require('../assets/accelerometer_icon.png'),
            'camera': require('../assets/camera_icon.png'),
            'gyroscope': require('../assets/gyroscope_icon.png'),
            'microphone': require('../assets/microphone_icon.png')
        }

        let sensorButtonIcons = this.state.sensorNames.map((sensorName, i) => {
            return <ToggleButton
                key={i}
                icon={iconDictionary[sensorName]}
                value={sensorName}
                status={this.state.checkedStatus[sensorName]}
                onPress={() => {this.toggleGraphDisplay(sensorName)}}
                onLongPress={() => {this.displayToast(sensorName)}}
                delayPressIn={500}
            />
        })
        //status={status}

        // console.log(sensorButtonIcons)

        return (

            <View style={[styles.container, { flexDirection: 'column' }]}>

                <Appbar.Header>
                    <Appbar.Content title="Recording #" />
                </Appbar.Header>

                <View style={styles.content}>


                    <View style={styles.graphStyling}>
                        <LineChart
                            data={data}
                            width={Dimensions.get('window').width - 20} // from react-native. 20 here means that the width of the graph will be 20 padding less than the width of the screen
                            height={220}
                            chartConfig={chartConfig}
                            style={{
                                marginVertical: 0,
                                marginHorizontal: 0,
                            }}
                            withDots={false}
                            withVerticalLines={false}
                            withHorizontalLines={false}
                            bezier
                        />
                    </View>

                    <View style={{flexDirection: "row", paddingBottom: 10 }}>
                        {sensorButtonIcons}
                    </View>

                    <FlatList style={styles.list}
                        data={labels}
                        keyExtractor={item => item.labelName}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity onPress={() => this.setLabel(item)}>
                                <View elevation={5} style={styles.listItem}>
                                    <Text style={styles.listItemText}> {item.labelName} </Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    />

                    <View>
                        <Button title="Finish" color="#6200F2"
                                onPress={() => this.props.navigation.navigate('HomeScreen')} />
                        <Button title="Cancel" color="#6200F2"
                                onPress={() => this.props.navigation.navigate('HomeScreen')} />
                    </View>
                </View>
                <Toast ref={(toast) => this.toast = toast}
                    position='top'
                    positionValue={70}
                    style={{backgroundColor:'white'}}
                    textStyle={{color:'black'}}
                    opacity={0.8}
                    // fadeInDuration={1000} Not sure these work, computer's a bit laggy
                    // fadeOutDuration={1000}
                />
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 0,
    },
    content: {
        flex: 1,
        padding: 10
    },
    heading: {
        padding: 0,
        backgroundColor: '#6200F2',
    },
    headingText: {
        color: '#FFFFFF',
        fontSize: 20,
        padding: 20,
    },
    graphStyling: {
        flex: 0,
    },
    list: {
        flex: 1,
        paddingTop: 10,
    },
    listItem: {
        borderRadius: 5,
        height: 80,
        backgroundColor: '#FFFFFF',
        marginTop: '5%',
        marginLeft: 10,
        marginRight: 10,
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
});

export default RecordingScreen;
