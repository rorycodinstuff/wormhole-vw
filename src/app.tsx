/// <reference path="./global.d.ts" />

import { render } from 'react-dom';
import React from 'react';
import Ty from 'typewriter-effect';
import ScCont from './reactModules/SceneController';
import content from './writing';

const run = () => {
  render(<ScCont />, document.querySelector('#base-div'));
};
export default run;
