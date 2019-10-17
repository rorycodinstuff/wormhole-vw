import React, { Component } from 'react';

interface Props {
  onPress: VoidFunction;
}
interface State {
  loading: boolean;
}

export default class ReadyButton extends Component<Props, State> {
  state = { loading: true };

  render() {
    return (
      <button onClick={this.props.onPress}>Ready! Click here to begin</button>
    );
  }
}
