precision highp float;
precision highp int;

varying vec2 uv;
uniform vec2 u_resolution;
uniform float step_index;

uniform float total_steps;
uniform float jump_length;
uniform sampler2D seed_tex;
/* region HelperFunctions */
const vec4 RED = vec4(1.0, 0.0, 0.0, 1.0);
const vec4 GREEN = vec4(0.0, 1.0, 0.0, 1.0);
const vec4 BLUE = vec4(0.0, 0.0, 1.0, 1.0);
const vec4 BLACK = vec4(0.0, 0.0, 0.0, 1.0);
const vec4 WHITE = vec4(1.0, 1.0, 1.0, 1.0);

// 0.005 * 255 is roughly 1.2, so this will match colors
// one digit away from each other.

// Return true if `a` and `b` are at most EPSILON apart
// in any dimension
const float EPSILON = 0.005;
bool approxEqual(const vec4 a, const vec4 b) {
  return all(
    lessThan(abs(a - b), vec4(EPSILON))
  );
}

bool approxEqual(const vec2 a, const vec2 b) {
  return all(
    lessThan(abs(a - b), vec2(EPSILON))
  );
}


bool between(const vec2 value, const vec2 bottom, const vec2 top) {
  return (
    all(greaterThan(value, bottom)) &&
    all(lessThan(value, top))
  );
}

bool validUv(const vec2 uv) {
  return between(
    uv,
    vec2(0., 0.),
    vec2(1., 1.)
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
vec2 encodeScreenCoordinate(const float value_) {
  float value = value_;
  return vec2(
    floor(value / 100.),
    mod(value, 100.)
  );
}

float decodeScreenCoordinate(const vec2 channels) {
  return channels.x * 100. + channels.y;
}

float sqDist(vec2 a, vec2 b) {
  return abs(pow((a.x-b.x),2.)+pow((a.y-b.y),2.));
}
vec2 cell_closestSeed(const vec4 obj_) {
  vec4 obj = obj_ * 255.;
  float x = decodeScreenCoordinate(obj.rg);
  float y = decodeScreenCoordinate(obj.ba);
  return vec2(x, y) + vec2(0.5);
}
vec4 createCell(const vec2 screenCoordinate_){
  vec2 screenCoordinate=floor(screenCoordinate_);
  vec2 rg=encodeScreenCoordinate(screenCoordinate.x);
  vec2 ba=encodeScreenCoordinate(screenCoordinate.y);
  return vec4(rg,ba)/255.;
}
// Return true if `a` and `b` are at most EPSILON apart
// in any dimension
vec4 createInvalidCell(){
  return createCell(vec2(5000.,5000.));
}
vec2 flipY(vec2 inpos){
  return vec2(inpos.x,1.-inpos.y);
}
/* endregion */

void main(){
  vec2 correct_uv=flipY(gl_FragCoord.xy);
  vec2 this_pos=gl_FragCoord.xy;
  // float rad=max(u_resolution.x,u_resolution.y);
  float min_dist=1000.;
  vec4 best_seed=createInvalidCell();
  vec2 pixel_length=1./u_resolution;
  
  for(float xp=-1.;xp<=1.;xp++){
    for(float yp=-1.;yp<=1.;yp++){
      vec2 offset=vec2(xp,yp)*jump_length;
      vec2 gridUv=(gl_FragCoord.xy+offset)/u_resolution;
      vec2 sensor_pos=offset+this_pos;
      vec2 sensor_uv=sensor_pos/u_resolution;
      if(!validUv(sensor_uv))continue;
      vec4 seed=texture2D(seed_tex,sensor_uv);
      // if(seed.b>.5)continue;
      vec2 seed_pos=cell_closestSeed(seed);
      float seed_dist=distance(seed_pos,this_pos);
      if(seed_dist<min_dist){
        min_dist=seed_dist;
        best_seed=seed;
      }
    }
  }
  gl_FragColor=best_seed;
  
}