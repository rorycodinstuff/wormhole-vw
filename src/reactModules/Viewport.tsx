import React, { Component } from 'react';

interface Props {}
interface State {}

export default class Viewport extends Component<Props, State> {
  state = {};

  render() {
    return (
      <div className='viewport' style={{ height: window.innerHeight }}>
        a
      </div>
    );
  }
}
