precision mediump float;

uniform sampler2D id;
varying vec2 uv;

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
vec2 flipY(vec2 inpos){
  return vec2(inpos.x,1.-inpos.y);
}
void main(){
  vec2 u_resolution=vec2(512.,512.);
  vec2 correct_uv=vec2(
    gl_FragCoord.x/u_resolution.x,
    (u_resolution.y-gl_FragCoord.y)/u_resolution.y
  );
  
  gl_FragColor=texture2D(id,flipY(correct_uv));
  // gl_FragColor=vec4(correct_uv,1.,1.);
}
