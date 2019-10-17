import React, { Component } from 'react';
import LoadingScreen from './LoadingScreen';
import MainScreen from './MainScreen';
enum SCENE {
  load,
  play,
}
interface Props {}
interface State {
  scene: SCENE;
}

export default class SceneController extends Component<Props, State> {
  state = {
    scene: SCENE.load,
  };
  swapScenes = () => this.setState(({ scene }) => ({ scene: (scene + 1) % 2 }));
  render() {
    return this.state.scene === SCENE.load ? (
      <LoadingScreen passThroughFunc={this.swapScenes} />
    ) : (
      <MainScreen />
    );
  }
}
