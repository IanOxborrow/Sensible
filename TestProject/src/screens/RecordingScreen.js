/* eslint-disable prettier/prettier */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React, {Component} from 'react';
 import {HardwareType, SensorInfo, SensorType} from '../Sensors';
 import {LineChart} from 'react-native-chart-kit';
 import Appbar from '../react-native-paper-src/components/Appbar';
 import ToggleButton from '../react-native-paper-src/components/ToggleButton';
 import Toast, {DURATION} from 'react-native-easy-toast';
 import FAB from '../react-native-paper-src/components/FAB/FAB';
 import {
     StyleSheet,
     View,
     Text,
     Dimensions,
     Button,
     FlatList,
     TouchableOpacity,
     Image,
     Modal,
     TouchableWithoutFeedback,
 } from 'react-native';
 import RecordingManager from "../RecordingManager";

 const data = {
     labels: [],
     datasets: [
         {
             data: [],
         },
     ],
 };

 let yAxisTitle = "Y axis";

 // hsl to hexadecimal conversion from https://stackoverflow.com/questions/36721830/convert-hsl-to-rgb-and-hex
 const hslToHex = (h, s, l) => {
     l /= 100;
     const a = s * Math.min(l, 1 - l) / 100;
     const f = n => {
         const k = (n + h / 30) % 12;
         const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
         return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
     };
     return `#${f(0)}${f(8)}${f(4)}`;
 };

 const chartConfig = {
     backgroundColor: '#000000',
     backgroundGradientFrom: "#000000",
     backgroundGradientTo: "#000000",
     color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
 };


 class RecordingScreen extends Component {
     constructor(props) {
         super(props);
         this.lastGraphUpdate = 0;
         this.graphUpdateInterval = 400; // in ms
         this.state = {
             startTime: new Date(),
             lastUpdateTime: new Date(),
             dataSource: [0],
             labelSource: ['0'],
             currentLabel: null,
             labels: props.route.params.labels,
             sensorIds: props.route.params.sensors,
             checkedStatus: {},
             currentSensor: -1,
             recorderzIndex: -1,
             terminating: false,
             subscriptions: [],
             indicatorStatus: true,
             helpShown: false,
         };

         console.log(this.state.sensorIds);
         // A dictionary corresponding to the hue value for the colour of each label
         this.labelsPallet = new Map();
         for (let i = 0; i < this.state.labels.length; i++) {
             let hue_step = Math.floor(360 / this.state.labels.length);
             this.labelsPallet[this.state.labels[i].labelName] = i * hue_step;
         }

         //set the checked status of the first sensor to be true
         this.state.checkedStatus[this.state.sensorIds[0]] = 'checked'
         this.state.currentSensor = this.state.sensorIds[0]

         // Ensure the recording class has been initialised
         if (RecordingManager.currentRecording == null) {
             throw new Error('NewRecordingScreen.constructor: RecordingManager.currentRecording has not been initialised');
         }

         // Enable all sensors and start all recorders
         RecordingManager.currentRecording.start();
         // Set an empty label and the meta file
         RecordingManager.currentRecording.startTime = Date.now();
         RecordingManager.currentRecording.setLabel(null);
         RecordingManager.currentRecording.createMetadataFile();

         this.state.subscriptions.push(setInterval(() => {this.toggleIndicators()}, 1000));
         this.state.subscriptions.push(setInterval(() => {this.setState({})}, this.graphUpdateInterval));

     }

     componentWillUnmount() {
        for (let i = 0; i < this.state.subscriptions.length; i++) {
            clearTimeout(this.state.subscriptions[i])
        }
     }

     /**
       * Created by Ryan Turner
       *
       * Toggles the display of the indicators
       */
     toggleIndicators() {
        this.setState({indicatorStatus: !this.state.indicatorStatus})
     }

     // Funtion to create each item in the list
     Item({title, onSelect}) {
         return (
             <View style={styles.listItem} onPress={() => onSelect()}>
                 <Text style={styles.listItemText}>{title}</Text>
             </View>
         );
     }

     /**
      * Created by Chathura Galappaththi
      *
      * Sets the current label
      * @param label The new label to set as current
      */
     setLabel(label) {
         let newLabel = null;
         // Update the label if a different button is pressed
         if (label.labelName !== this.state.currentLabel) {
             newLabel = label.labelName;
         }
         // Update the label
         RecordingManager.currentRecording.setLabel(newLabel);
         this.state.currentLabel = newLabel;
         // Output a debug message
         console.log(newLabel == null ? "Cleared " + label.labelName + " label" : "Set label to " + newLabel);
     }

     /**
      * Written by ?, Modified by Chathura Galappaththi
      * @param sensorId The ID of the sensor to show the graph data for
      */
     toggleGraphDisplay(sensorId) {
         // Unselect the current button
         this.state.checkedStatus[this.state.currentSensor] = 'unchecked';
         // Select the new button
         this.state.currentSensor = sensorId
         console.log(this.state.currentSensor)
         this.state.checkedStatus[sensorId] = 'checked';

         if (sensorId == SensorType.BACK_CAMERA) {
             this.setState({recorderzIndex: 1});
         }
         else {
             this.setState({recorderzIndex: -1});
         }
     }

     // Displays a toast when a button is long pressed
     displayToast(sensorName) {
         // Making the toast (delicious)
         this.toast.show('Sensor: ' + sensorName, 2000);
     }

     sensorIndicators() {
         return (
            <View>
                <Image source={SensorInfo[9].imageSrc} style={[styles.sensorIndicator, {marginEnd: 'auto'}]}/>
            </View>
         );
     };

     updateGraphData() {
         let maxPoints = 10;
         // Add a new point
         let sample = null;

         if (SensorInfo[this.state.currentSensor].type != HardwareType.SENSOR) {
             return;
         }

         sample = RecordingManager.currentRecording.getSensorData(this.state.currentSensor).getLatestSample();
         yAxisTitle = SensorInfo[this.state.currentSensor].measure + "(" + SensorInfo[this.state.currentSensor].units + ")"

         // Don't update the graph if a new sample hasn't come in
         if (sample == null) {
             return;
         }

         // TODO: Use data from `this.state` and the `getData()` function of each sample to create n axis
         // this.state.dataSource.push(sample.x); // TODO: Figure out how to display 3 axis
         this.state.dataSource.push(sample.getData()[0]);
         // Add the corresponding x-value
         let timeElapsed = (new Date() - this.state.lastUpdateTime) / 1000;
         if (timeElapsed >= 1) {
             this.state.lastUpdateTime = new Date();
             let label = Math.round((new Date() - this.state.startTime) / 1000);
             this.state.labelSource.push(label.toString());
         } else if (timeElapsed > 0.5 && timeElapsed < 0.8) {
             let labelText = this.state.currentLabel;
             labelText = labelText ? labelText : '';
             this.state.labelSource.push(labelText);
         } else {
             this.state.labelSource.push('');
         }

         // Remove the first point (from the front)
         if (this.state.dataSource.length >= maxPoints) {
             this.state.dataSource.shift();
             this.state.labelSource.shift();
         }

         if (this.state.currentLabel) {
             chartConfig.backgroundGradientTo = hslToHex(this.labelsPallet[this.state.currentLabel], 50, 50);
             chartConfig.backgroundGradientFrom = hslToHex((this.labelsPallet[this.state.currentLabel] + 10) % 360, 50, 50);
         } else {
             chartConfig.backgroundGradientTo = "#000000";
             chartConfig.backgroundGradientFrom = "#000000";
         }

         this.lastGraphUpdate = Date.now();
     };

     render() {
         // Limit the rate at which the graph is updated
         if (Date.now() - this.lastGraphUpdate >= this.graphUpdateInterval) {
             this.updateGraphData();
             this.lastGraphUpdate = Date.now();
         }

         data.datasets[0].data = this.state.dataSource.map(value => value);
         data.labels = this.state.labelSource.map(value => value);

         let sensorButtonIcons = this.state.sensorIds.map(sensorId => {
             // Mic does not get a button (#9)
             if (sensorId != 9) {
                 return <ToggleButton
                     key={sensorId}
                     icon={SensorInfo[sensorId].imageSrc}
                     value={SensorInfo[sensorId].name}
                     status={this.state.checkedStatus[sensorId]}
                     onPress={() => {
                         this.toggleGraphDisplay(sensorId)
                     }}
                     onLongPress={() => {
                         this.displayToast(SensorInfo[sensorId].name)
                     }}
                     delayPressIn={500}
                 />
             }
         })

         return (

             <View style={[styles.container, {flexDirection: 'column'}]}>

                 <Appbar.Header>
                     <Appbar.Content title={RecordingManager.currentRecording.name}/>
                     <Appbar.Action style={[styles.helpIcon]} size={35} icon={require("../assets/help_icon.png")}
                                                          onPress={() => {this.setState({helpShown: true})}}/>
                     <View id="indicators" style={[this.state.indicatorStatus ? styles.indicators : styles.indicatorsOff]}>
                        {this.state.sensorIds.includes("9") ? <Image source={SensorInfo[9].imageSrc} style={[styles.sensorIndicator, {marginEnd: 'auto'}]}/> : <View></View>}
                        {this.state.sensorIds.includes("12") ? <Image source={SensorInfo[12].imageSrc} style={[styles.sensorIndicator, {marginEnd: 'auto'}]}/> : <View></View>}
                     </View>
                 </Appbar.Header>

                 <View style={styles.content}>
                     <View>
                         <View style={{flex: 1, zIndex: this.state.recorderzIndex}}>
                             {
                                 RecordingManager.currentRecording.enabledRecorders[SensorType.BACK_CAMERA] &&
                                 RecordingManager.currentRecording.enabledRecorders[SensorType.BACK_CAMERA].getView()
                             }
                         </View>

                         <View>
                             <View style={styles.graphStyling}>
                                 <Text style={styles.yLabel}>{yAxisTitle}</Text>
                                 <LineChart
                                     data={data}
                                     width={Dimensions.get('window').width - 20} // from react-native. 20 here means that the width of the graph will be 20 padding less than the width of the screen
                                     height={220}
                                     verticalLabelRotation={17}
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
                             <Text style={styles.xLabel}>Time (Seconds)</Text>
                         </View>
                     </View>

                     <View style={{flexDirection: "row", paddingBottom: 10, backgroundColor: "#efefef", zIndex: 2}}>
                         {sensorButtonIcons}
                     </View>

                     <FlatList style={styles.list}
                               data={this.state.labels}
                               keyExtractor={item => item.labelName}
                               renderItem={({item, index}) => (
                                   <TouchableOpacity onPress={() => this.setLabel(item)}>
                                       <View elevation={5} style={styles.listItem}>
                                           <Text style={styles.listItemText}> {item.labelName} </Text>
                                       </View>
                                   </TouchableOpacity>
                               )}
                     />

                     <View>
                         <Button title="Finish" color="#6200F2"
                                 disabled={this.state.terminating}
                                 onPress={async () => {
                                     this.setState({terminating: true});
                                     for (let i = 0; i < this.state.subscriptions.length; i++) {
                                         clearTimeout(this.state.subscriptions[i])
                                     }
                                     await RecordingManager.currentRecording.finish();
                                     this.props.navigation.navigate('HomeScreen', {
                                         complete: true,
                                     });
                                 }}/>
                         <Button title="Cancel" color="#6200F2"
                                 disabled={this.state.terminating}
                                 onPress={async () => {
                                     this.setState({terminating: true});
                                     for (let i = 0; i < this.state.subscriptions.length; i++) {
                                         clearTimeout(this.state.subscriptions[i])
                                     }
                                     await RecordingManager.currentRecording.finish(true);
                                     this.props.navigation.navigate('HomeScreen', {
                                         complete: false,
                                     });
                                 }}/>
                     </View>
                 </View>
                 <Toast ref={(toast) => this.toast = toast}
                        position='top'
                        positionValue={70}
                        style={{backgroundColor: 'white'}}
                        textStyle={{color: 'black'}}
                        opacity={0.8}
                     // fadeInDuration={1000} Not sure these work, computer's a bit laggy
                     // fadeOutDuration={1000}
                 />
                 <Modal
                     animationType="fade"
                     transparent={true}
                     visible={this.state.helpShown}>
                     <TouchableWithoutFeedback onPress={() => {
                         this.setState({helpShown: false})
                     }}>
                         <View style={styles.modalOverlay}/>
                     </TouchableWithoutFeedback>

                     <View style={styles.parentView}>
                         <View style={styles.modalView}>
                             <Text>A tutorial video can be found here: link</Text>
                             <FAB
                                 style={{marginTop: 10}}
                                 label="Close"
                                 onPress={() => {
                                     this.setState({helpShown: false})
                                 }}
                             />
                         </View>
                     </View>
                 </Modal>
             </View>
         );
     }

 }

 const styles = StyleSheet.create({
     yLabel: {
         transform: [{rotate: "-90deg"}, {translateY: 1.8 ** yAxisTitle.length + 60 / yAxisTitle.length}],
         fontWeight: "bold",
     },
     xLabel: {
         fontWeight: "bold",
         textAlign: "center",
     },
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
         flexDirection: 'row',
         justifyContent: 'flex-end',
         alignItems: 'center',
     },
     list: {
         flex: 1,
         paddingTop: 10,
         backgroundColor: "#efefef",
         zIndex: 2
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
     sensorIndicator: {
         flex: 1,
         margin: 0,
         width: 30,
         height: 30,
     },
     indicators: {
        justifyContent: 'flex-end',
        marginTop: 5,
     },
     indicatorsOff: {
        justifyContent: 'flex-end',
        marginTop: 5,
        display: 'none',
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

     closeModal: {
         marginTop: 10,
         alignSelf: 'center'
         //marginLeft: 100,
         //marginRight: 100,
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

 export default RecordingScreen;
