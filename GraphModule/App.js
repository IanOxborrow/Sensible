/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react';
import {WebView} from "react-native-webview";

class MyWeb extends Component {
    render() {
        return (
            <WebView
                source={{
                    html: `
                        <html>
                            <head>
                            </head>
                            <body>
                                <canvas id="graphPlane"></canvas>
                                <script>
                                
                                    const GREY = "rgba(190,190,190,0.6)";
                                    const RED = "rba(190,0,0,0.3)"
                                    
                                    // map a value from one range to another
                                    function mapRange(i, iStart, iEnd, oStart, oEnd) {
                                        return oStart + ((oEnd - oStart) / (iEnd - iStart)) * (i - istart);
                                    }
                                
                                    xData = [1,2,3,4,5];
                                    yData = [1,2,3,4,5];
                                
                                    let width = 400;
                                    let height = 150;
                                    let tickWidth = 20;
                                    let tickHeight = 20;
                                    let yMax = Math.max(...data.y);
                                    let yMin = Math.min(...data.y);
                                    
                                    var canvas = document.getElementById("graphPlane");
                                    canvas.width = width;
                                    canvas.height = height;
                                    var tx = canvas.getContext("2d");
                                    
                                    tx.moveTo(0,0);
                                    tx.lineTo(200,100);
                                    tx.stroke();
                                    
                                    // function line(tx, x1, y1, x2, y2, col) {
                                    //     // push the contents of the canvas
                                    //     tx.save()
                                    //    
                                    //     // set stroke colour to line colour
                                    //     tx.strokeStyle(col);
                                    //    
                                    //     // draw the line
                                    //     tx.beginPath();
                                    //     tx.moveTo(x1,y1);
                                    //     tx.lineTo(x2,y2);
                                    //     tx.stroke();
                                    //    
                                    //     // pop the contents of the canvase
                                    //     tx.restore();
                                    // }
                                    //
                                    // // draw the vertical grid lines
                                    // for(let x = 0; x <= width; x+=width/tickWidth) {
                                    //     line(tx, x, 0, x, height, GREY);
                                    // }
                                    //
                                    // // draw the horizontal grid lines
                                    // for(let y = 0; y <= height; y+=height/tickHeight) {
                                    //     line(tx, 0, y, width, y, GREY);
                                    // }
                                    //
                                    // // draw the data points
                                    // for(let i = 0, i < xData.length - 1; i++) {
                                    //     x1 = xData[i];
                                    //     x2 = xData[i+1];
                                    //     y1 = mapRange(yData[i], yMin, yMax, 0, tickHeight);
                                    //     y2 = mapRange(yData[i+1], yMin, yMax, 0, tickHeight);
                                    //     line(tx, x1, y1, x2, y2, RED)
                                    // }
                                    
                                </script>
                            </body>
                        </html>
                        `,
                }}
            />
        );
    }
}

export default MyWeb;
