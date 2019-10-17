import React, { Component } from 'react';
import B from './keyButton';
interface Props {}
interface State {}

export default class Controls extends Component<Props, State> {
  state = {};

  render() {
    return (
      <div className='sidebar'>
        <div>
          <h3>Wormhole Interaction Interface</h3>
          <p>
            The interface is controlled through the keyboard or the following
            buttons
          </p>
        </div>
        <div className='button-con'>
          <div></div>
          <div>--</div>
          <div>-</div>
          <div>+</div>
          <div>++</div>
          <div>azimoth</div>
          <B key='q' func={() => this}>
            Q
          </B>
          <B key='w' func={() => this}>
            W
          </B>
          <B key='e' func={() => this}>
            E
          </B>
          <B key='r' func={() => this}>
            R
          </B>
          <div>altitude</div>
          <B key='a' func={() => this}>
            A
          </B>
          <B key='s' func={() => this}>
            S
          </B>
          <B key='d' func={() => this}>
            D
          </B>
          <B key='f' func={() => this}>
            F
          </B>
          <div>tone</div>
          <B key='z' func={() => this}>
            Z
          </B>
          <B key='x' func={() => this}>
            X
          </B>
          <B key='c' func={() => this}>
            C
          </B>
          <B key='v' func={() => this}>
            V
          </B>
        </div>
        <div className='output-text'>
          <h4>Output</h4>
        </div>
      </div>
    );
  }
}
