precision highp float;

uniform sampler2D input_points;
uniform sampler2D vid_points;
varying vec2 uv;
uniform vec2 u_resolution;

const vec4 RED=vec4(1.,0.,0.,1.);
const vec4 GREEN=vec4(0.,1.,0.,1.);
const vec4 BLUE=vec4(0.,0.,1.,1.);
const vec4 BLACK=vec4(0.,0.,0.,1.);
const vec4 WHITE=vec4(1.,1.,1.,1.);

// 0.005 * 255 is roughly 1.2, so this will match colors
// one digit away from each other.
const float EPSILON=.005;

// Return true if `a` and `b` are at most EPSILON apart
// in any dimension
bool approxEqual(const vec4 a,const vec4 b){
  return all(
    lessThan(abs(a-b),vec4(EPSILON))
  );
}

bool approxEqual(const vec2 a,const vec2 b){
  return all(
    lessThan(abs(a-b),vec2(EPSILON))
  );
}

bool between(const vec2 value,const vec2 bottom,const vec2 top){
  return(
    all(greaterThan(value,bottom))&&
    all(lessThan(value,top))
  );
}

bool validUv(const vec2 uv){
  return between(
    uv,
    vec2(0.,0.),
    vec2(1.,1.)
  );
}

// Split a float into two base-255 encoded floats. Useful for storing
// a screen co-ordinate as the rg part or ba part of a pixel.
//
// This can be passed fractional values. If it's passed (300.5, 300.5)
// then it will return
//
//     vec2(floor(300.5 / 255.), mod(300.5, 255.))
//
// which is vec2(1.0, 45.5). Then later, when decoding, we return
//
//     channels.x * 255. + channels.y
//
// which is 1.0 * 255. + 45.5 which is 300.5. The returned pair has
// values in the interval [0.0, 255.0). This means that it can be
// stored as a color value in an UNSIGNED_BYTE texture.
//
vec2 encodeScreenCoordinate(const float value_){
  float value=value_;
  return vec2(
    floor(value/100.),
    mod(value,100.)
  );
}

float decodeScreenCoordinate(const vec2 channels){
  return channels.x*100.+channels.y;
}

vec2 flipY(vec2 inpos){
  return vec2(inpos.x,1.-inpos.y);
}
vec4 createCell(const vec2 screenCoordinate_){
  vec2 screenCoordinate=floor(screenCoordinate_);
  vec2 rg=encodeScreenCoordinate(screenCoordinate.x);
  vec2 ba=encodeScreenCoordinate(screenCoordinate.y);
  return vec4(rg,ba)/255.;
}
vec4 createInvalidCell(){
  return createCell(vec2(5000.,5000.));
}
void main(){
  vec2 correct_uv=flipY(uv);
  vec2 this_pos=correct_uv*u_resolution;
  vec4 prePoint=texture2D(input_points,correct_uv);
  vec4 test=vec4(.5,.5,.5,.1);
  vec4 col;
  if(prePoint.a>.001){
    col=createCell(this_pos);
  }else{
    col=createInvalidCell();
  }
  gl_FragColor=col;
}
