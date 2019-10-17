import React, { Component } from 'react';
import Controls from './Controls';
import Viewport from './Viewport';

interface Props {}
interface State {}

export default class MainScreen extends Component<Props, State> {
  state = {};

  render() {
    return (
      <div className='main-screen' style={{ height: window.innerHeight }}>
        <Controls />
        <Viewport />
      </div>
    );
  }
}
