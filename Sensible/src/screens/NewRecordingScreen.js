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

const DATA = [
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      title: 'First Item',
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      title: 'Second Item',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      title: 'Third Item',
    },
  ];
  
const sensorListItem = ({ item }) => (
  <View style={{flexDirection: 'row', alignItems: 'center'}}>
    <Text style={styles.title}>{item.sensorName}</Text>
    <DropDownPicker
      items={[
        {label: 'Acceleromoter', value: 'acceleromoter', hidden: true},
        {label: 'Gyroscope', value: 'gyroscope' },
        {label: 'Microphone', value: 'microphone'},
          /*{label: 'Acceleromoter', value: 'acceleromoter', icon: () => <Icon name="flag" size={18} color="#900" />, hidden: true},
          {label: 'Gyroscope', value: 'gyroscope', icon: () => <Icon name="flag" size={18} color="#900" />},
          {label: 'Microphone', value: 'microphone', icon: () => <Icon name="flag" size={18} color="#900" />},*/
      ]}
      defaultValue={'acceleromoter'}
      containerStyle={{height: 40}}
      style={{backgroundColor: '#fafafa'}}
      itemStyle={{
          justifyContent: 'flex-start'
      }}
      dropDownStyle={{backgroundColor: '#fafafa'}}
      /*onChangeItem={item => this.setState({
          country: item.value
      })}*/
    />
    <TextInput placeholder="sample rate"/>
    <Image source={require("../assets/baseline_close_black.png")}/>
  </View>
);

//constant item that stays at the bottom of the list. This acts as the add new row in the list
const sensorListFooter = () => {
  return (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
    <Text style={styles.title}>{""}</Text>
    <DropDownPicker
      items={[
        {label: 'Acceleromoter', value: 'acceleromoter', hidden: true},
        {label: 'Gyroscope', value: 'gyroscope' },
        {label: 'Microphone', value: 'microphone'},
          /*{label: 'Acceleromoter', value: 'acceleromoter', icon: () => <Icon name="flag" size={18} color="#900" />, hidden: true},
          {label: 'Gyroscope', value: 'gyroscope', icon: () => <Icon name="flag" size={18} color="#900" />},
          {label: 'Microphone', value: 'microphone', icon: () => <Icon name="flag" size={18} color="#900" />},*/
      ]}
      defaultValue={'acceleromoter'}
      containerStyle={{height: 40}}
      style={{backgroundColor: '#fafafa'}}
      itemStyle={{
          justifyContent: 'flex-start'
      }}
      dropDownStyle={{backgroundColor: '#fafafa'}}
      /*onChangeItem={item => this.setState({
          country: item.value
      })}*/
    />
    <TextInput placeholder="sample rate"/>
    <Image source={require("../assets/baseline_add_black.png")}/>
  </View>
  );
};

const labelListItem = ({ item }) => (
  <View style={{flexDirection: 'row', alignItems: 'center'}}>
    
    <TextInput placeholder="sample rate"/>
    <Image source={require("../assets/baseline_close_black.png")}/>
  </View>
);

//constant item that stays at the bottom of the list. This acts as the add new row in the list
const labelListFooter = () => {
  return (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
    
      <TextInput placeholder="sample rate"/>
      <Image source={require("../assets/baseline_add_black.png")}/>
    </View>
  );
};
  


class NewRecordingScreen extends Component {

  constructor(props) {

    super(props);
    
    this.selectedSensors = [{sensorName: 'yeet'}, {sensorName: 'blitfegy'}]
    this.addedLabels = [{labelName: "label1"}, {labelName: "label2"}]
  }

  

  signUpClick = () => {
    console.log("yeet")
    DATA.push({
        id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
        title: 'First Item',
      })

    console.log(DATA)
  }

  signInClick = () => {
      
  }

  componentDidMount = () => {
  
  }

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

        <View>
          <Text >{"Sensors"}</Text>
          <Text >{"Sample Rate"}</Text>
        </View>


        <FlatList
          data={this.selectedSensors}
          renderItem={sensorListItem}
          keyExtractor={item => item.sensorName} 
          ListFooterComponent = {sensorListFooter}/>

        <View>
          <Text >{"Labels"}</Text>
        </View>

        <FlatList
          data={this.addedLabels}
          renderItem={labelListItem}
          keyExtractor={item => item.labelName} 
          ListFooterComponent = {labelListFooter}/>

        <FloatingAction
          //{actions={actions}}
          title={"ipydepdfhgi"}
          onPressItem={name => {
            console.log(`selected button: ${name}`);
          }} />

      </View>
    );
  }
}


const styles = StyleSheet.create({})

//export default StackNav

export default NewRecordingScreen;
