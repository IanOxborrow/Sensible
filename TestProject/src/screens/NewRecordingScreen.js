import 'react-native-gesture-handler';
import React, { Component, useState, useRef} from 'react';
//import { IconButton, Colors } from 'react-native-paper';
import { FloatingAction } from "react-native-floating-action";
//import { FAB } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
//import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import FAB from '../react-native-paper-src/components/FAB/FAB'

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
      currentSensorSelection: "acceleromoter",
      currentSampleRate: "",
      currentLabelAddition: "",
      selectedSensorData: [],
      selectedSensors: [],
      addedLabels: []
    }

    this.sensorPicker;
    
    this.usedSensors = {'acceleromoter': false, 'gyroscope': false, 'microphone': false}
  }

  componentDidMount = () => {
    //make sure that the accelorometer is the default item in the picker view
    //this.sensorPicker.selectItem('acceleromoter');
  }

  sensorListHeader = () => {

  }

  sensorListItem = ({ item }) => (
    <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
      <Text style={styles.title}>{item.sensorName}</Text>
      
      <Text>{item.sampleRate}</Text>
      
      <TouchableOpacity 
          style={{marginLeft: 'auto'}} 
          onPress={() => {  
            console.log('waspressed' + item.sensorName)
            //use the sensor name to identify which row was pressed to work out which data to remove

            //make the sensor as not being used
            this.usedSensors[item.sensorName] = false

            //remove the sensor from the sensordata array
            for (var i in this.state.selectedSensorData) {
              var sensorData = this.state.selectedSensorData[i]
              if (item.sensorName == sensorData['sensorName']){
                this.state.selectedSensorData.splice(i,1);
                break;
              }
            }

            //update the listview
            this.setState({selectedSensors: [...this.state.selectedSensorData] })
            
            //set the new default vaule to be the first non hidden value
            for (key in this.usedSensors) {
              if (!this.usedSensors[key]) {
                this.sensorPicker.selectItem(key);
                break
              }

              //if all the sensors have been selected, set the curret selection to the 'empty' value
              this.sensorPicker.selectItem('empty')
            }

          }}>
            
            <Image source={require("../assets/baseline_close_black.png")} style={{marginLeft: 'auto'}}/>
        </TouchableOpacity>
    </View>
  );

  //constant item that stays at the bottom of the list. This acts as the add new row in the list
  sensorListFooter = () => {
    return (
      <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
        <Text style={styles.title}>{""}</Text>
        <DropDownPicker
          ref={this.sensorPickerRef}
          items={[
            {label: 'Acceleromoter', value: 'acceleromoter', hidden: this.usedSensors['acceleromoter']},
            {label: 'Gyroscope', value: 'gyroscope', hidden: this.usedSensors['gyroscope']},
            {label: 'Microphone', value: 'microphone', hidden: this.usedSensors['microphone']},
            {label: '', value: 'empty', hidden: true},
              /*{label: 'Acceleromoter', value: 'acceleromoter', icon: () => <Icon name="flag" size={18} color="#900" />, hidden: true},
              {label: 'Gyroscope', value: 'gyroscope', icon: () => <Icon name="flag" size={18} color="#900" />},
              {label: 'Microphone', value: 'microphone', icon: () => <Icon name="flag" size={18} color="#900" />},*/
          ]}
          defaultValue={'acceleromoter'}
          controller={instance => this.sensorPicker = instance}

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

            //make sure that a value has been entered into the lable name textinput before the button is allowed to be pressed
            if (this.state.currentSensorSelection != "empty" && this.state.currentSampleRate != "") {
              newSensor = {sensorName: this.state.currentSensorSelection, 
                          sampleRate: this.state.currentSampleRate}

              //add the selected sensor to a dictioany to mark that it has been selected
              this.usedSensors[this.state.currentSensorSelection] = true

              this.state.selectedSensorData.push(newSensor)
              this.setState({selectedSensors: [...this.state.selectedSensorData] })
              
              //set the new default vaule to be the first non hidden value
              for (key in this.usedSensors) {
                if (!this.usedSensors[key]) {
                  this.sensorPicker.selectItem(key);
                  break
                }

                //if all the sensors have been selected, set the curret selection to the 'empty' value
                this.sensorPicker.selectItem('empty')
              }

              this.sampleRateInput.clear()
            }
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

      <TouchableOpacity 
          style={{marginLeft: 'auto'}} 
          onPress={() => {  
            console.log('waspressed' + item.labelName)
            //use the label name to identify which row was pressed to work out which data to remove

            //remove the selected label from the list
            for (var i in this.state.addedLabels) {
              if (item.labelName == this.state.addedLabels[i]['labelName']){
                this.state.addedLabels.splice(i,1);
                break;
              }
            }

            this.setState({addedLabels: [...this.state.addedLabels] })

          }}>
            
            <Image source={require("../assets/baseline_close_black.png")} style={{marginLeft: 'auto'}}/>
        </TouchableOpacity>
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
            
            //return if a duplicate has been found
            for (i in this.state.addedLabels) {
              if (this.state.addedLabels[i]['labelName'] == this.state.currentLabelAddition) {
                return
              }
            }

            //make sure that a value has been entered into the lable name textinput before the button is allowed to be pressed
            // and make sure that the label name is not in the addedLabels already
            if (this.state.currentLabelAddition != "") {

              newLabel = {labelName: this.state.currentLabelAddition}
              this.state.addedLabels.push(newLabel)
              this.setState({addedLabels: [...this.state.addedLabels] })
              
              this.labelNameInput.clear()
            }
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
          keyExtractor={item => item.sensorName} 
          ListFooterComponent = {this.sensorListFooter}/>

        <View>
          <Text >{"Labels"}</Text>
        </View>

        <FlatList
          data={this.state.addedLabels}
          renderItem={this.labelListItem}
          keyExtractor={item => item.labelName} 
          ListFooterComponent = {this.labelListFooter}/>

        <FAB
            style={styles.fab}
            label="Start Recording"
            onPress={name => {
              this.props.navigation.navigate('RecordingScreen', {'sensors': this.state.selectedSensors, 'labels': this.state.addedLabels})
            }} 
          />
      </View>
    );
  }
}


const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 15,
    bottom: 15,
  },
})

//export default StackNav

export default NewRecordingScreen;
