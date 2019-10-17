import React, { Component } from 'react';
import ReadyButton from './ReadyButton';
import LoadingText from './LoadingText';
interface Props {
  passThroughFunc: VoidFunction;
}
interface State {
  hasLoaded: boolean;
  text: string;
}

export default class LoadingScreen extends Component<Props, State> {
  state = { hasLoaded: false, text: Math.floor(Date.now() / 1).toString(16) };
  animReq: number = 0;
  updateTime = () => {
    this.setState({ text: Math.floor(Date.now() / 50).toString(16) });
    this.animReq = requestAnimationFrame(this.updateTime);
  };

  componentDidMount() {
    this.animReq = requestAnimationFrame(this.updateTime);
    this.setState({ hasLoaded: true });
  }
  componentWillUnmount() {
    cancelAnimationFrame(this.animReq);
  }
  render() {
    return (
      <div className='loading-screen'>
        <div style={{ gridArea: 'cn' }}>
          <h1 style={{ textAlign: 'center' }}>Wormhole</h1>
          <p>
            A wormhole has sucked up some of the best young writing in Australia
            and New Zealand and regurgitated an exquisite corpse for the digital
            era. This collaborative multimedia piece joins together four young
            artists from Voiceworks Online and Starling literary journals,
            combining text, video, audio and code. Each artist will
            independently respond to the theme ‘wormhole’, with the final work
            coming together as an emergent, collaborative piece of digital
            debris.
          </p>
          <p>
            Featuring work by Sinead Overbye, Veronica Charmont, Ruby Mae
            Hinepunui Solly and Ruby Quail. Presented in partnership with
            Voiceworks and Starling
          </p>
          <p>
            This piece has an audio component and uses webGL which requires a
            recent computer, it is also optemised for a 16:10 aspect ratio
            screen
          </p>
          <p>{this.state.text}</p>
          {this.state.hasLoaded ? (
            <ReadyButton onPress={this.props.passThroughFunc} />
          ) : (
            <LoadingText />
          )}
        </div>
      </div>
    );
  }
}
