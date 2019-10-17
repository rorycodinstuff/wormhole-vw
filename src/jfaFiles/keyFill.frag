precision highp float;

uniform sampler2D input_points;
uniform sampler2D input_key;
varying vec2 uv;
uniform vec2 u_resolution;

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
vec2 flipY(vec2 inpos){
  return vec2(inpos.x,1.-inpos.y);
}
float sstep(float low,float high,float t)
{
  t=clamp((t-low)/(high-low),0.,1.);
  return t*t*(3.-2.*t);
}
void main(){
  vec2 correct_uv=vec2(
    gl_FragCoord.x/u_resolution.x,
    (u_resolution.y-gl_FragCoord.y)/u_resolution.y
  );
  vec2 this_pos=correct_uv*u_resolution;
  vec4 pre_point=texture2D(input_points,flipY(correct_uv));
  vec2 key_pos=colToPos(pre_point);
  float col=sstep(0.,1.,length(key_pos-this_pos)/5.);
  gl_FragColor=vec4(vec3(col),1.);
  // gl_FragColor=pre_point;
}
