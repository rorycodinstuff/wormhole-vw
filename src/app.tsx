/// <reference path="./global.d.ts" />

import { render } from 'react-dom';
import React from 'react';
import Ty from 'typewriter-effect';
import content from './writing';
const Boom = ({ cameo }: any) => {
  const vid = fetch(
    'https://ruby-quail-portfolio-images.s3-ap-southeast-2.amazonaws.com/640x480.webm',
    {}
  )
    .then(resp => {
      return resp.blob();
    })
    .then(blob => {
      let url = URL.createObjectURL(blob);
      let vid = (
        <video
          autoPlay
          muted
          preload='auto'
          style={{
            maxHeight: '800px',
          }}
        >
          <source type='video/webm' src={url} />
          you're browser sucks
        </video>
      );
      render(vid, document.querySelector('#base-div'));
    });
};

const run = () => {
  const x = Boom({});
  // render(x, document.querySelector('#base-div'));
};
export default run;
