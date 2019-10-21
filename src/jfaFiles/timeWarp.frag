precision highp float;

uniform sampler2D id;
uniform sampler2D vid;
uniform sampler2D u_vidFrames[10];
uniform vec2 u_resolution;
varying vec2 uv;

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
float sqDist(vec2 a,vec2 b){
  return abs(pow((a.x-b.x),2.)+pow((a.y-b.y),2.));
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
float map(float t,float m1,float M1,float m2,float M2,bool cl){
  float T=(t-m1)/M1;
  float result=(T*(M2-m2))+m2;
  if(cl){
    return clamp(result,m2,M2);
  }else{
    return result;
  }
}
float decodeScreenCoordinate(const vec2 channels){
  return channels.x*100.+channels.y;
}
vec2 cell_closestSeed(const vec4 obj_){
  vec4 obj=obj_*255.;
  float x=decodeScreenCoordinate(obj.rg);
  float y=decodeScreenCoordinate(obj.ba);
  return vec2(x,y)+vec2(.5);
}
vec2 flipY(vec2 inpos){
  return vec2(inpos.x,1.-inpos.y);
}
void main(){
  
  vec2 correct_uv=flipY(uv);
  vec2 otherPosition=cell_closestSeed(texture2D(id,correct_uv));
  float dist=sqrt(sqDist(correct_uv*u_resolution,otherPosition));
  // vec2 offset=(correct_uv*u_resolution)-otherPosition;
  // float angle=asin(offset.y/dist);
  // vec2 newPoint=vec2(cos(angle)*dist,sin(angle)*dist);
  // vec2 newV=(otherPosition+newPoint)/u_resolution;
  // vec2 otherUv=otherPosition/u_resolution;
  // float invertedx=mod(.5+correct_uv.x,1.);
  float id=floor(dist/30.);
  vec4 timeTex=texture2D(u_vidFrames[9],correct_uv);
  if(id==0.){
    timeTex=texture2D(u_vidFrames[0],correct_uv);
  }else if(id==1.){
    timeTex=texture2D(u_vidFrames[1],correct_uv);
  }else if(id==2.){
    timeTex=texture2D(u_vidFrames[2],correct_uv);
  }else if(id==3.){
    timeTex=texture2D(u_vidFrames[3],correct_uv);
  }else if(id==4.){
    timeTex=texture2D(u_vidFrames[4],correct_uv);
  }else if(id==5.){
    timeTex=texture2D(u_vidFrames[5],correct_uv);
  }else if(id==6.){
    timeTex=texture2D(u_vidFrames[6],correct_uv);
  }else if(id==7.){
    timeTex=texture2D(u_vidFrames[7],correct_uv);
  }else if(id==8.){
    timeTex=texture2D(u_vidFrames[8],correct_uv);
  }else if(id==9.){
    timeTex=texture2D(u_vidFrames[9],correct_uv);
  }
  
  // if(mod(id,2.)<.01)timeTex=vec4(vec3(1.),0.)-timeTex;
  gl_FragColor=vec4(timeTex.rgb,1.);
  // gl_FragColor=vec4(correct_uv,1.,1.);
}
