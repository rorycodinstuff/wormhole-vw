import React, { Component } from 'react';
import LoadingScreen from './LoadingScreen';
import MainScreen from './MainScreen';
import Controller from './Controller';
import { controllerContext } from './contContext';
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
    controller: new Controller(),
  };
  componentDidMount() {
    this.state.controller.fetchFiles();
  }
  swapScenes = () => this.setState(({ scene }) => ({ scene: (scene + 1) % 2 }));
  render() {
    return (
      <controllerContext.Provider value={this.state.controller}>
        {this.state.scene === SCENE.load ? (
          <LoadingScreen passThroughFunc={this.swapScenes} />
        ) : (
          <MainScreen />
        )}
      </controllerContext.Provider>
    );
  }
}
