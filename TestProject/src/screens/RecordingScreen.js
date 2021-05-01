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
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    Button,
    FlatList,
    TouchableOpacity,
} from 'react-native';

var DATA = [
    {
        id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
        title: 'Label Name 1',
    },
    {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
        title: 'Label Name 2',
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d72',
        title: 'Label Name 3',
    },
    {
        id: 'njq29823-nde8-12nb-23hd-14557ie2id72',
        title: 'Label Name 4',
    },
];

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
        };

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
        if (label.labelName === this.state.currentLabel)
        {
            return;
        }
        // Update the label
        App.recording.setLabel(label.labelName);
        this.state.currentLabel = label.labelName;
    }

    render()
    {

        const updateGraphData = () => {
            let maxPoints = 20;
            // Add a new point
            let sample = App.recording.getSensorData(SensorType.ACCELEROMETER).getLatestSample();
            this.state.dataSource.push(sample.x); // TODO: Figure out how to display 3 axis
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

        return (
            <View style={[styles.container, { flexDirection: 'column' }]}>
                <View style={styles.heading}>
                    <Text style={styles.headingText}>
                        Recording #
                    </Text>
                </View>

                <View style={styles.graphStyling}>
                    <LineChart
                        data={data}
                        width={Dimensions.get('window').width - 10} // from react-native
                        height={220}
                        chartConfig={chartConfig}
                        style={{
                            marginVertical: 5,
                            marginHorizontal: 5,
                        }}
                        withDots={false}
                        withVerticalLines={false}
                        withHorizontalLines={false}
                        bezier
                    />
                </View>


                <FlatList style={styles.list}
                          data={labels}
                          keyExtractor={item => item.labelName}
                          renderItem={({ item, index }) => (
                              <TouchableOpacity onPress={() => this.setLabel(item)}>
                                  <View style={styles.listItem}>
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
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 0,
    },
    heading: {
        padding: 0,
        backgroundColor: '#6200F2',
    },
    headingText: {
        color: 'white',
        fontSize: 20,
        padding: 20,
    },
    graphStyling: {
        flex: 1.5,
    },
    list: {
        flex: 1,
        padding: 20,
        paddingTop: 10,
    },
    listItem: {
        borderRadius: 5,
        height: 80,
        width: '100%',
        borderWidth: 2,
        borderColor: '#d1d1d1',
        backgroundColor: 'white',
        justifyContent: 'center',
        marginBottom: '5%',
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
