import React, { Component } from 'react';
import { controllerContext } from './contContext';
interface Props {}
interface State {}

export default class Viewport extends Component<Props, State> {
  state = {};
  static contextType = controllerContext;
  context!: React.ContextType<typeof controllerContext>;
  render() {
    return (
      <div className='viewport' style={{ height: window.innerHeight }}>
        <video muted autoPlay src={this.context.videoURL}></video>
        <audio src={this.context.audioURL} autoPlay></audio>
      </div>
    );
  }
}
