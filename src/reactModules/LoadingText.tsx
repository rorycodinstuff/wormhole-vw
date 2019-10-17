import React, { Component } from 'react';

interface Props {}
interface State {
  animProg: number;
}

export default class LoadingText extends Component<Props, State> {
  state = {
    animProg: 0,
  };
  intRef = -1;
  updateAnim = () => {
    this.setState({ animProg: (this.state.animProg + 1) % 4 });
  };
  componentDidMount = () => {
    this.intRef = window.setInterval(this.updateAnim, 500);
  };
  componentWillUnmount = () => {
    window.clearInterval(this.intRef);
  };
  render() {
    return <div>Loading{'.'.repeat(this.state.animProg)}</div>;
  }
}
