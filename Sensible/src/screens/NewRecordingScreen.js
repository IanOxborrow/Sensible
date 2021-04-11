import 'react-native-gesture-handler';
import React, { Component, useState } from 'react';
//import { IconButton, Colors } from 'react-native-paper';
import { FloatingAction } from "react-native-floating-action";
//import { FAB } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
//import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StatusBar,
  FlatList,
  Button
} from 'react-native';


class NewRecordingScreen extends Component {

  constructor(props) {

    super(props);
    //this.props = props
    this.state = {
      currentSensorSelection: "",
      currentSampleRate: "",
      currentLabelAddition: "",
      selectedSensorData: [],
      selectedSensors: [],
      addedLabels: []
    }

    this.usedSensors = {}
  }

  componentDidMount = () => {
  
  }

  sensorListHeader = () => {

  }

  sensorListItem = ({ item }) => (
    <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
      <Text style={styles.title}>{item.sensorName}</Text>
      
      <Text>{item.sampleRate}</Text>
      
      <Image source={require("../assets/baseline_close_black.png")} style={{marginLeft: 'auto'}}/>
    </View>
  );

  //constant item that stays at the bottom of the list. This acts as the add new row in the list
  sensorListFooter = () => {
    return (
      <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
        <Text style={styles.title}>{""}</Text>
        <DropDownPicker
          items={[
            {label: 'Acceleromoter', value: 'acceleromoter', hidden: false},
            {label: 'Gyroscope', value: 'gyroscope' },
            {label: 'Microphone', value: 'microphone'},
              /*{label: 'Acceleromoter', value: 'acceleromoter', icon: () => <Icon name="flag" size={18} color="#900" />, hidden: true},
              {label: 'Gyroscope', value: 'gyroscope', icon: () => <Icon name="flag" size={18} color="#900" />},
              {label: 'Microphone', value: 'microphone', icon: () => <Icon name="flag" size={18} color="#900" />},*/
          ]}
          defaultValue={'acceleromoter'}
          containerStyle={{height: 40, width: 150}}
          style={{backgroundColor: '#fafafa'}}
          itemStyle={{
              justifyContent: 'flex-start'
          }}
          dropDownStyle={{backgroundColor: '#fafafa'}}
          
          onChangeItem={
            item => this.setState({currentSensorSelection: item.value})
          }
        />

        <TextInput 
          placeholder="sample rate" 
          ref={input => { this.sampleRateInput = input }}
          onChangeText={
            text => this.setState({currentSampleRate: text})
          }
        />

        <TouchableOpacity 
          style={{marginLeft: 'auto'}} 
          onPress={() => {  
            //update the flatlist with the new information
            newSensor = {sensorName: this.state.currentSensorSelection, 
                         sampleRate: this.state.currentSampleRate}
            this.state.selectedSensorData.push(newSensor)
            this.setState({selectedSensors: [...this.state.selectedSensorData] })
            
            this.sampleRateInput.clear()
          }} 
          >
          <Image source={require("../assets/baseline_add_black.png")} />
        </TouchableOpacity>

      </View>
    );
  };

  labelListItem = ({ item }) => (
    <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
      
      <Text>{item.labelName}</Text>
      <Image source={require("../assets/baseline_close_black.png")} style={{marginLeft: 'auto'}}/>
    </View>
  );

  //constant item that stays at the bottom of the list. This acts as the add new row in the list
  labelListFooter = () => {
    return (
      <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
      
        <TextInput 
          placeholder="Label Name"
          ref={input => { this.labelNameInput = input }}
          onChangeText={
            text => this.setState({currentLabelAddition: text})
          } />

        <TouchableOpacity 
          style={{marginLeft: 'auto'}} 
          onPress={() => {  
            //update the flatlist with the new information
            newLabel = {labelName: this.state.currentLabelAddition}
            this.state.addedLabels.push(newLabel)
            this.setState({addedLabels: [...this.state.addedLabels] })
            
            this.labelNameInput.clear()
          }} >
          <Image source={require("../assets/baseline_add_black.png")} style={{marginLeft: 'auto'}}/>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <StatusBar barStyle="dark-content" />

        <Text style={styles.baseText}>
          <Text style={styles.titleText}>
            {"dydyepdypedpe"}
            {"\n"}
            {"\n"}
          </Text>
          <Text numberOfLines={5}>{"pydf"}</Text>
        </Text>

        <View style={{flexDirection: 'row'}}>
          <Text >{"Sensors"}</Text>
          <Text >{"Sample Rate"}</Text>
        </View>

        <FlatList
          data={this.state.selectedSensors}
          renderItem={this.sensorListItem}
          keyExtractor={item => item} 
          ListFooterComponent = {this.sensorListFooter}/>

        <View>
          <Text >{"Labels"}</Text>
        </View>

        <FlatList
          data={this.state.addedLabels}
          renderItem={this.labelListItem}
          keyExtractor={item => item.labelName} 
          ListFooterComponent = {this.labelListFooter}/>

        <FloatingAction
          onPressMain={name => {
            this.props.navigation.navigate('RecordingScreen', {'sensors': [], 'labels': []})
          }} 
        />

      </View>
    );
  }
}


const styles = StyleSheet.create({})

//export default StackNav

export default NewRecordingScreen;
