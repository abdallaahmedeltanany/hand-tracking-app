// src/components/HandTracking.js
import React, { useRef, useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as handpose from '@tensorflow-models/handpose';
import '@tensorflow/tfjs-backend-webgl';

const drawHand = (predictions, ctx) => {
  if (predictions.length > 0) {
    predictions.forEach((prediction) => {
      const landmarks = prediction.landmarks;

      // Draw the landmarks
      for (let i = 0; i < landmarks.length; i++) {
        const x = landmarks[i][0];
        const y = landmarks[i][1];
        

        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = 'red';
        ctx.fill();
      }
    });
  }
};

const HandTracking = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const runHandpose = async () => {
      const net = await handpose.load();
      setLoading(false);

      const video = videoRef.current;

      const detect = async () => {
        if (video.readyState === 4) {
          const videoWidth = video.videoWidth;
          const videoHeight = video.videoHeight;

          video.width = videoWidth;
          video.height = videoHeight;

          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');

          canvas.width = videoWidth;
          canvas.height = videoHeight;

          const hand = await net.estimateHands(video);
          ctx.clearRect(0, 0, videoWidth, videoHeight);
          drawHand(hand, ctx);

          requestAnimationFrame(detect);
        }
      };

      detect();
    };

    const startVideo = () => {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          let video = videoRef.current;
          video.srcObject = stream;
          video.play();
        })
        .catch((err) => {
          console.error("Error accessing webcam: ", err);
        });
    };

    startVideo();
    runHandpose();
  }, []);

  return (
    <div>
      {loading && <div>Loading model...</div>}
      <video ref={videoRef} autoPlay style={{transform:'scalex(-1)'}}  />
      <canvas ref={canvasRef} style={{ border: '1px solid black' }} />
    </div>
  );
};

export default HandTracking;
