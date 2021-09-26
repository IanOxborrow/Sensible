/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {Component} from 'react';
import { StyleSheet, Text, View, TouchableHighlight,} from 'react-native';

import { WebglPlot, WebglLine, ColorRGBA } from "webgl-plot";


import {GCanvasView, GImage} from '@flyskywhy/react-native-gcanvas';

import WebglGraph from './OpenGlGraph'

export default class App extends Component {
  
  constructor(props) {
    super(props);
    this.canvas = null;
    this.state = {
      debugInfo: 'Click me to draw some on canvas',
    };

    // only useful on Android, because it's always true on iOS
    this.isGReactTextureViewReady = true;
  }

  initCanvas = (canvas) => {
    console.log("init canvas")
    console.log(canvas)
    if (this.canvas) {
      console.log("get to hihht")
      return;
    }

    this.canvas = canvas;
    if (Platform.OS === 'web') {
      // canvas.width not equal canvas.clientWidth, so have to assign again
      this.canvas.width = this.canvas.clientWidth;
      this.canvas.height = this.canvas.clientHeight;
    }
    this.ctx = this.canvas.getContext('2d');
  };

  drawSome = async () => {
    // On Android, sometimes this.isGReactTextureViewReady is false e.g.
    // navigate from a canvas page into a drawer item page with
    // react-navigation on Android, the canvas page will be maintain
    // mounted by react-navigation, then if you continually call
    // this drawSome() in some loop, it's wasting CPU and GPU,
    // if you don't care about such wasting, you can delete
    // this.isGReactTextureViewReady and related onIsReady.
    console.log("draw some")

    if (this.ctx && this.isGReactTextureViewReady) {
      console.log(this.isGReactTextureViewReady)

      console.log(this.canvas)
      console.log(this.ctx)

      let webglp = new WebglPlot(this.canvas);
      const numX = 1000;

      let line = new WebglLine(new ColorRGBA(1, 0, 0, 1), numX);
      webglp.addLine(line);
      line.arrangeX();
    
      
      ////////

            //const freq = 0.001;
      //const noise = 0.1;
      //const amp = 0.5;
      const noise1 = 0.6 || 0.5;

      for (let i = 0; i < line.numPoints; i++) {
        const ySin = Math.sin(Math.PI * i * 0.001 * Math.PI * 2);
        const yNoise = Math.random() - 0.5;
        line.setY(i, ySin * 0.5 + yNoise * noise1);
      }
      //id = requestAnimationFrame(renderPlot);
      webglp.update();
      console.log("was called")
    //id = requestAnimationFrame(renderPlot);

    }
  };

  tick() {
    this.setState(state => ({
      seconds: state.seconds + 1
    }));
  }


  render() {
    console.log("render was called")
    return (
      <View style={styles.container}>
        <WebglGraph/>
        <TouchableHighlight onPress={this.drawSome}>
          <Text style={styles.welcome}>{this.state.debugInfo}</Text>
        </TouchableHighlight>
        {Platform.OS === 'web' ? (
          <canvas
            ref={this.initCanvas}
            style={
              {
                width: 200,
                height: 300,
              } /* canvas with react-native-web can't use width and height in styles.gcanvas */
            }
          />
        ) : (
          <GCanvasView
            onCanvasCreate={this.initCanvas}
            onIsReady={(value) => (this.isGReactTextureViewReady = value)}
            isGestureResponsible={true /* Here is just for example, you can remove this line because default is true */}
            style={styles.gcanvas}
          />
        )}
        <TouchableHighlight onPress={this.takePicture}>
          <Text style={styles.welcome}>Click me toDataURL()</Text>
        </TouchableHighlight>
      </View>

  );
  }
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#768',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gcanvas: {
    width: 200,
    height: 300,
    // backgroundColor: '#FF000030', // TextureView doesn't support displaying a background drawable since Android API 24
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 20,
  },
});