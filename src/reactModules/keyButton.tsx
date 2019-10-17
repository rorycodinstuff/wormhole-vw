import React, { Component, Children } from 'react';

interface Props {
  func: VoidFunction;
  key: string;
}
interface State {}

export default class keyButton extends Component<Props, State> {
  state = {};
  onKeyPress = (e: KeyboardEvent) => {
    const { key, func } = this.props;
    if (e.key === key) func();
  };
  componentDidMount = () => {
    window.addEventListener('keypress', this.onKeyPress);
  };
  componentWillUnmount = () => {
    window.removeEventListener('keypress', this.onKeyPress);
  };
  render() {
    return (
      <button type='button' onClick={() => this.props.func()}>
        {this.props.children}
      </button>
    );
  }
}
