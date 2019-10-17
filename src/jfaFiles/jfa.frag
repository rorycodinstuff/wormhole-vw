precision highp float;
varying vec2 uv;
uniform vec2 u_resolution;
uniform float step_index;

uniform float total_steps;
uniform float jump_length;
uniform sampler2D seed_tex;
/* region HelperFunctions */
vec4 posToCol(vec2 pos){
  vec4 outp=vec4(1.);
  outp.r=floor(pos.x/255.);
  outp.g=mod(pos.x,256.);
  outp.b=floor(pos.y/255.);
  outp.a=mod(pos.y,256.);
  return outp/255.;
}
vec2 colToPos(vec4 color){
  vec4 inp=floor(255.*color);
  vec2 outp=vec2(1.);
  outp.x=(inp.r*255.)+inp.g;
  outp.y=(inp.b*255.)+inp.a;
  return outp;
}
float sqDist(vec2 a, vec2 b) {
  return abs(pow((a.x-b.x),2.)+pow((a.y-b.y),2.));
}
const float EPSILON = 0.005;

// Return true if `a` and `b` are at most EPSILON apart
// in any dimension
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
vec2 flipY(vec2 inpos){
  return vec2(inpos.x,1.-inpos.y);
}
/* endregion */

void main(){
  vec2 correct_uv=vec2(
    gl_FragCoord.x/u_resolution.x,
    (u_resolution.y-gl_FragCoord.y)/u_resolution.y
  );
  vec2 this_pos=correct_uv*u_resolution;
  float rad=max(u_resolution.x,u_resolution.y);
  float min_dist=99999999.;
  vec4 best_seed=vec4(1.,0.,1.,1.);
  vec2 pixel_length=1./u_resolution;
  
  for(float xp=-1.;xp<=1.;xp++){
    for(float yp=-1.;yp<=1.;yp++){
      vec2 offset=vec2(xp,yp)*jump_length;
      vec2 sensor_pos=offset+this_pos;
      vec2 sensor_uv=sensor_pos/u_resolution;
      if(!validUv(sensor_uv))continue;
      vec4 seed=texture2D(seed_tex,flipY(sensor_uv));
      vec2 seed_pos=colToPos(seed);
      float seed_dist=length(seed_pos-this_pos);
      if(seed_dist<min_dist){
        min_dist=seed_dist;
        best_seed=seed;
      }
    }
  }
  gl_FragColor=best_seed;
  
}