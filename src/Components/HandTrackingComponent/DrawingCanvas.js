import React, { useRef, useState, useEffect } from 'react';
import '@tensorflow/tfjs-backend-webgl';
import * as handpose from '@tensorflow-models/handpose';
import { drawHand } from './Utilities';

const DrawingCanvas = () => {
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const [context, setContext] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = 780;
    canvas.height = 490;
    ctx.strokeStyle = "#913d88";
    ctx.lineWidth = 15;
    setContext(ctx);

    // Set up the webcam feed
    const setupCamera = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      return new Promise((resolve) => {
        videoRef.current.onloadedmetadata = () => {
          resolve(videoRef.current);
        };
      });
    };

    const detectHands = async (net) => {
      const video = videoRef.current;
      video.play();
      setInterval(async () => {
        const hand = await net.estimateHands(video);
        if (hand.length > 0) {
          const landmarks = hand[0].landmarks;
          // Reverse the x-coordinate for each landmark
          const mirroredLandmarks = landmarks.map(point => [canvas.width - point[0], point[1]]);
          drawHand(mirroredLandmarks, ctx);
        }
      }, 100);
    };

    const runHandpose = async () => {
      const net = await handpose.load();
      await setupCamera();
      detectHands(net);
    };

    runHandpose();
  }, [context]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.isDrawing = false; // Reset drawing state
    ctx.prevX = null;
    ctx.prevY = null;
  };

  return (
    <div style={{ background: '#e74c3c', padding: '50px 0', textAlign: 'center' }}>
      <video
        ref={videoRef}
        style={{
          transform: 'scaleX(-1)', // Mirror the video feed
          top: '50px',
          width: '780px',
          height: '490px',
          display: 'block',
        }}
      />
      <canvas
        ref={canvasRef}
        id="canvas"
        style={{
          position: 'relative',
          left: 'calc(50% - 390px)',
          border: '1px dotted black',
          cursor: 'crosshair',
          background: '#ecf0f1',
        }}
      />
      <button onClick={clearCanvas} style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px' }}>
        Clear Canvas
      </button>
    </div>
  );
};

export default DrawingCanvas;