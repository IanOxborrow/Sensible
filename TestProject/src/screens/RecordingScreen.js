/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Button,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {LineChart} from 'react-native-chart-kit';

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


class RecordingScreen extends Component {

  constructor(props) {

    super(props);
    
    sensors = props.route.params.sensors
    labels = props.route.params.labels
    console.log(props.route.params.sensors)
    console.log(props.route.params.labels)

    this.state = {
        dataSource: [Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random()],
        labelSource: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
    }
  }

  // Funtion to create each item in the list
  Item({ title, onSelect }) {
    return (
        <View style={styles.listItem} onPress={() => onSelect()}>
            <Text style={styles.listItemText}>{title}</Text>
        </View>
    );
  }

  render() {
    const test = () => {
      // Update the data
      this.state.dataSource.push(Math.random());
      this.state.dataSource.shift();
      // Re-render the graph
      this.setState({});
    };

    data.datasets[0].data = this.state.dataSource.map(value => value);
    data.labels = this.state.labelSource.map(value => value);

    return (
      <View style={[styles.container, {flexDirection: "column"}]}>
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
              yAxisLabel={'$'}
              chartConfig={chartConfig}
              bezier
              style={{
                 marginVertical: 5,
                 marginHorizontal: 5,
              }}
            />
          </View>
          <Button onPress={test} title={'Add data point'} color='#6200F2'/>

  
          <FlatList style={styles.list}
              data={labels}
              keyExtractor={item => item.labelName} 
              renderItem={({item, index}) => (
                  <TouchableOpacity onPress={() => null}>
                      <View style={styles.listItem}>
                          <Text style={styles.listItemText}> {item.labelName} </Text>
                      </View>
                  </TouchableOpacity>
              )}
          />
  
          <View>
              <Button title="Finish" color='#6200F2' onPress={() => this.props.navigation.navigate('HomeScreen')}/>
              <Button title="Cancel" color='#6200F2' onPress={() => this.props.navigation.navigate('HomeScreen')}/>
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
    color: "white",
    fontSize: 20,
    padding:20,
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
    marginBottom: '5%'
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