import React from 'react';
import './App.css';
import HandTracking from './Components/HandTracking/HandTracking';
import HandTrackingComponent from './Components/HandTrackingComponent/HandTrackingComponent';
import DrawingCanvas from './Components/HandTrackingComponent/DrawingCanvas';

function App() {
  return (
    <div className="App">
        <header className="App-header">
        <h1>Hand Tracking with React</h1>
        <DrawingCanvas/>
        {/* <HandTrackingComponent/> */}
        {/* <HandTracking/> */}
      
      </header>
      
    </div>
  );
}

export default App;
