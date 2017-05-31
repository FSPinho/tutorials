import React, { Component } from 'react';

import { DevicesAnimation } from './devices-animation'

class App extends Component {
  render() {
    return (
      <div className="App" style={{
        position: 'fixed',
        top: 0, bottom: 0, left: 0, right: 0,
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'center'
      }}>

        <DevicesAnimation/>
        
      </div>
    );
  }
}

export default App;
