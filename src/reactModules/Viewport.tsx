import React, { Component } from 'react';
import { controllerContext } from './contContext';
import Visuals from './Visuals';
interface Props {}
interface State {}

export default class Viewport extends Component<Props, State> {
  state = {};
  viewRef = React.createRef<HTMLDivElement>();
  static contextType = controllerContext;
  context!: React.ContextType<typeof controllerContext>;
  videoRef = React.createRef<HTMLVideoElement>();
  audioRef = React.createRef<HTMLAudioElement>();
  componentDidMount() {}
  render() {
    return (
      <div
        ref={this.viewRef}
        className='viewport'
        style={{ height: window.innerHeight }}
      >
        <Visuals parentRef={this.viewRef} />
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
