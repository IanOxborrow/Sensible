import React, {useState, useEffect, useRef } from "react";

import { WebglPlot, WebglLine, ColorRGBA } from "webgl-plot";
import {GCanvasView, GImage} from '@flyskywhy/react-native-gcanvas';


let webglp: WebglPlot;
let line: WebglLine;
//let canvas: 
//let ctx:

type prop = {
  freq: number;
  amp: number;
  noise?: number;
};

export default function WebglGraph({freq, amp, noise}: prop) {
    
    //const graphCanvas = useRef<HTMLCanvasElement>(null);
    
    const [isGReactTextureViewReady, setReady] = useState(false);
    const [canvas, setCanvas] = useState(null);
    const [ctx, setctx] = useState(null);


    //var canvas: any = null;
    //var ctx: any;

    let initCanvas = (c: any) => {
      console.log("init")

      // canvas will be null by default. if it is not null then we return early
      if (canvas) {
          return;
      }

      setCanvas(c)
      if (Platform.OS === 'web') {
          // canvas.width not equal canvas.clientWidth, so have to assign again
          canvas.width = canvas.clientWidth;
          canvas.height = canvas.clientHeight;
      }
      console.log(canvas)
      setctx(c.getContext('2d'));
      console.log(ctx)

      console.log(isGReactTextureViewReady)
    };

    // create the x values of each point on the line
    useEffect(() => {

      var fpsInterval = 1000 / 30; // 10 fps
      var then = Date.now();

      console.log("use effect was called")
      //console.log(graphCanvas)
      //const ctx = canvas.getContext('2d');

      if (ctx && isGReactTextureViewReady) {
          
        console.log("got to here")


        //webglp = new WebglPlot(canvas);
        const numX = 1000;
        
        //line = new WebglLine(new ColorRGBA(1, 0, 0, 1), numX);
        //webglp.addLine(line);
  
        //line.arrangeX();
        
        let id = 0;
        let renderPlot = () => {
          //const freq = 0.001;
          //const noise = 0.1;
          //const amp = 0.5;
        
          var now = Date.now();
          var elapsed = now - then;

          if (elapsed > fpsInterval) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            then = now - (elapsed % fpsInterval);

            const noise1 = 0.6 || 0.5;
      
            console.log("redrawing graph")

            var lastSign = 0;

            ctx.beginPath();

            for (let i = 0; i < numX; i++) {
              var d = new Date();
              const ySin = Math.sin(Math.PI * i * 0.01 + d.getMilliseconds()/100) * 100 + 100;
              //console.log(ySin + " " + d.getMilliseconds())
              const yNoise = Math.random() - 0.5;
              //line.setY(i, ySin * 0.5 + yNoise * noise1);
              ctx.moveTo(i-1, lastSign)
              ctx.lineTo(i, ySin)
              ctx.stroke();

              lastSign = ySin;

            }

            //webglp.update();

          }

          requestAnimationFrame(renderPlot);

        };

        renderPlot();
    
       
      }
    }, [isGReactTextureViewReady]);

    //create the y values??

    useEffect(() => {
        console.log("other use effect was called")

        /*
        let id = 0;
        let renderPlot = () => {
          //const freq = 0.001;
          //const noise = 0.1;
          //const amp = 0.5;
          const noise1 = noise || 0.5;
    
          for (let i = 0; i < line.numPoints; i++) {
            const ySin = Math.sin(Math.PI * i * freq * Math.PI * 2);
            const yNoise = Math.random() - 0.5;
            line.setY(i, ySin * amp + yNoise * noise1);
          }
          id = requestAnimationFrame(renderPlot);
          webglp.update();
        };
        id = requestAnimationFrame(renderPlot);
    
        return () => {
          renderPlot = () => {};
          cancelAnimationFrame(id);
        };*/
      }, [freq, amp, noise]);


    
    const gcanvas = {
        width: 200,
        height: 300,
        // backgroundColor: '#FF000030', // TextureView doesn't support displaying a background drawable since Android API 24
    };

    return (
        <GCanvasView
            onCanvasCreate={initCanvas}
            onIsReady={(value: boolean) => {
                console.log("ready")
                setReady(value)
            }}
            isGestureResponsible={true /* Here is just for example, you can remove this line because default is true */}
            style={gcanvas}
      />
    );
}
