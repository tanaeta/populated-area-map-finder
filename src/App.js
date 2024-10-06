import React, { useState } from 'react';
import MapComponent from './components/MapComponent.js';

const App = () => {
  return (
    <>
      <div className="h-[100vh]">
        <div className="h-[80vh]">
          <MapComponent />
        </div>
        <div className="h-[20vh]">
          Filters
        </div>
      </div>
    </>
    );
}

export default App;
