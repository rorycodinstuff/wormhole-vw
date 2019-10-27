import React, { Component } from 'react';
import B from './keyButton';
import Typewriter from 'typewriter-effect';
import text from '../writing';
import Pos from './polarPos';
import { controllerContext } from './contContext';
import Controller from './Controller';
interface Props {}
interface State {
  al: number;
  az: number;
  tone: number;
  pos: { x: number; y: number; z: number };
}

export default class Controls extends Component<Props, State> {
  state = {
    al: this.context.alt,
    az: this.context.azi,
    tone: this.context.tone,
    pos: { x: 0, y: 0, z: 0 },
  };
  static contextType = controllerContext;
  context!: Controller;
  updateState = (arg: { x: number; y: number; z: number }) => {
    const { x, y, z } = this.context;
    this.setState({
      al: this.context.alt,
      az: this.context.azi,
      tone: this.context.tone,
      pos: { x, y, z },
    });
  };
  componentDidMount() {
    this.context.attachPositionHandler(this.updateState);
  }

  render() {
    const { x, y, z } = this.state.pos;
    return (
      <div className='sidebar' style={{ maxHeight: window.innerHeight - 100}}>
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
          <B
            keyPresssed='q'
            func={() => this.context.updateVectors('azi', '--')}
          >
            Q
          </B>
          <B
            keyPresssed='w'
            func={() => this.context.updateVectors('azi', '-')}
          >
            W
          </B>
          <B
            keyPresssed='e'
            func={() => this.context.updateVectors('azi', '+')}
          >
            E
          </B>
          <B
            keyPresssed='r'
            func={() => this.context.updateVectors('azi', '++')}
          >
            R
          </B>
          <div>altitude</div>
          <B
            keyPresssed='a'
            func={() => this.context.updateVectors('alt', '--')}
          >
            A
          </B>
          <B
            keyPresssed='s'
            func={() => this.context.updateVectors('alt', '-')}
          >
            S
          </B>
          <B
            keyPresssed='d'
            func={() => this.context.updateVectors('alt', '+')}
          >
            D
          </B>
          <B
            keyPresssed='f'
            func={() => this.context.updateVectors('alt', '++')}
          >
            F
          </B>
          <div>tone</div>
          <B
            keyPresssed='z'
            func={() => this.context.updateVectors('tone', '--')}
          >
            Z
          </B>
          <B
            keyPresssed='x'
            func={() => this.context.updateVectors('tone', '-')}
          >
            X
          </B>
          <B
            keyPresssed='c'
            func={() => this.context.updateVectors('tone', '+')}
          >
            C
          </B>
          <B
            keyPresssed='v'
            func={() => this.context.updateVectors('tone', '++')}
          >
            V
          </B>
        </div>
        <div className='output-text'>
          <h4>Output</h4>
          <Pos
            pos={{ x, y, z }}
            al={this.state.al}
            az={this.state.az}
            tone={this.state.tone}
          />
          <div style={{ overflowY: 'scroll', maxHeight: 'auto' }}>
            <Typewriter
              options={{
                strings: text,
                cursor: '',
                autoStart: true,
                loop: false,
                delay: 16,
                wrapperClassName: 'output-small',
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}
