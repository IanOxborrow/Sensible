import React from 'react';
import {View, Text, Dimensions, Button} from 'react-native';
import {LineChart} from 'react-native-chart-kit';

const data = {
  labels: [],
  datasets: [
    {
      data: [],
    },
  ],
};

const data1 = {
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

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [Math.random(), Math.random(), Math.random(), Math.random(), Math.random()],
      labelSource: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
      dataSource1: [Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random()],
      labelSource1: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
    };
  }

  render() {
    const test = () => {
      let newSource = this.state.dataSource;
      newSource.push(Math.random());

      let tmpSource = this.state.labelSource;
      tmpSource.push('a');

      this.setState({
        dataSource: newSource,
      });
    };

    const test1 = () => {
      let newSource = this.state.dataSource1;
      newSource.push(Math.random());
      newSource.shift();

      this.setState({
        dataSource1: newSource,
      });
    };

    data.datasets[0].data = this.state.dataSource.map(value => value);
    data.labels = this.state.labelSource.map(value => value);
    data1.datasets[0].data = this.state.dataSource1.map(value => value);
    data1.labels = this.state.labelSource1.map(value => value);

    return (
      <View>
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
        <Button onPress={test} title={'Add data point'} />

        <LineChart
          data={data1}
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
        <Button onPress={test1} title={'Add data point'} />
      </View>
    );
  }
}

export default App;
