import React, { Component } from 'react';

interface Props {
  az:number;
  al:number;
  tone:number
  pos: {
    x:number,y:number,z:number
  }
}
interface State {
}

export default class polarPos extends Component<Props, State> {
  state = { };

  render() {
    const { az, al, tone } = this.props;
    const {x,y,z} = this.props.pos
    const {floor:fl,abs} = Math;
    return (
      <div>
        <pre>Azimoth:      {(az<0?'-':'+')+abs(fl(az*284)).toString(16).toUpperCase()}</pre>
        <pre>Altitude:     {(al<0?'-':'+')+abs(fl(al*284)).toString(16).toUpperCase()}</pre>
        <pre>Tone:         {(tone<0?'-':'+')+abs(fl(tone*284)).toString(16).toUpperCase()}</pre>
        <pre>X:            {(x<0?'-':'+')+abs(fl(x*64)).toString(16).toUpperCase()}</pre>
        <pre>Y:            {(y<0?'-':'+')+abs(fl(y*64)).toString(16).toUpperCase()}</pre>
        <pre>Z:            {(z<0?'-':'+')+abs(fl(z*64)).toString(16).toUpperCase()}</pre>
      </div>
    );
  }
}
