import React, { Component } from 'react';
import { controllerContext } from './contContext';
import Controller from './Controller';
interface Props {
  parentRef: React.RefObject<HTMLDivElement>;
}
interface State {
  dimms?: {
    width: number;
    height: number;
  };
}

export default class Visuals extends Component<Props, State> {
  state: State = { dimms: undefined };
  static contextType = controllerContext;
  context!: Controller;
  container?: HTMLDivElement;
  videoRef = React.createRef<HTMLVideoElement>();
  componentDidMount() {
    const { width } = this.container!.getBoundingClientRect();
    const newHeight = 0.75 * width;
    this.setState({ dimms: { width, height: newHeight } });
  }
  renderContent() {
    const wid = Math.floor(this.state.dimms!.width);
    const hei = Math.floor(this.state.dimms!.height);
    return (
      <>
        <video
          ref={this.videoRef}
          width={wid}
          height={hei}
          loop
          muted
          autoPlay
          src={this.context.videoURL}
        ></video>
        <canvas
          style={{ position: 'relative', left: '0px', top: `-${hei}px` }}
          id='gl'
          width={wid}
          height={hei}
        ></canvas>
        <canvas hidden id='text' width={wid} height={hei}></canvas>
      </>
    );
  }
  render() {
    return (
      <div
        ref={e => (this.container = e!)}
        style={{ width: '100%', marginTop: 'auto', marginBottom: 'auto' }}
      >
        {this.state.dimms && this.renderContent()}
      </div>
    );
  }
}
