import * as React from 'react';
import LoadingScreen from './LoadingScreen';
enum SCENES {
  load,
  main,
}
export class SceneController extends React.Component {
  scene;
  constructor(props) {
    super(props);
    this.scene = SCENES.load;
  }
  render() {
    switch (this.scene) {
      case SCENES.load:
        return <LoadingScreen />;
      default:
        break;
    }
  }
}
export default SceneController;
