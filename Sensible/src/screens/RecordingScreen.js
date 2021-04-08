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

// Funtion to create each item in the list
function Item({ title, onSelect }) {
    return (
        <View style={styles.listItem} onPress={() => onSelect()}>
            <Text style={styles.listItemText}>{title}</Text>
        </View>
    );
}

const App: () => React$Node = () => {
  return (
    <View style={[styles.container, {flexDirection: "column"}]}>
        <View style={styles.heading}>
            <Text style={styles.headingText}>
            Page Title
            </Text>
        </View>

        <View style={styles.graphStyling}>

        </View>

        <FlatList style={styles.list}
            data={DATA}
            renderItem={({item, index}) => (
                <TouchableOpacity onPress={() => null}>
                    <View style={styles.listItem}>
                        <Text style={styles.listItemText}> Label # </Text>
                    </View>
                </TouchableOpacity>
            )}
        />

        <View>
            <Button title="Finish" color='#6200F2' onPress={() => null}/>
            <Button title="Cancel" color='#6200F2' onPress={() => null}/>
        </View>

    </View>
  );
};

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
        flex: 1,
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

export default App;