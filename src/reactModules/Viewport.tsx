import React, { Component } from 'react';
import { controllerContext } from './contContext';
interface Props {}
interface State {}

export default class Viewport extends Component<Props, State> {
  state = {};
  static contextType = controllerContext;
  context!: React.ContextType<typeof controllerContext>;
  videoRef = React.createRef<HTMLVideoElement>();
  audioRef = React.createRef<HTMLAudioElement>();
  componentDidMount() {}
  render() {
    return (
      <div className='viewport' style={{ height: window.innerHeight }}>
        <video
          ref={this.videoRef}
          loop
          hidden
          muted
          autoPlay
          src={this.context.videoURL}
        ></video>
        <canvas id='gl'></canvas>
        <canvas hidden id='text'></canvas>
        <audio
          ref={this.audioRef}
          loop
          src={this.context.audioURL}
          autoPlay
        ></audio>
      </div>
    );
  }
}
