import React, { Component } from 'react';

interface Props {}
interface State {
  azi: number;
  alt: number;
  war: number;
}

export default class polarPos extends Component<Props, State> {
  state = { azi: 0.8, alt: 0.7, war: 0.6 };

  render() {
    const { alt, azi, war } = this.state;
    const {floor:fl} = Math;
    return (
      <div>
        <pre>Azimoth:      {fl(azi*100).toString(16).toUpperCase()}</pre>
        <pre>Altitude:     {fl(alt*100).toString(16).toUpperCase()}</pre>
        <pre>Warp:         {fl(war*100).toString(16).toUpperCase()}</pre>
      </div>
    );
  }
}
