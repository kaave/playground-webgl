precision mediump float;  // おまじないの一種 precisionで数値の精度を指定できる lowp mediump highp の順で制度が上がる

varying vec4 vColor;

void main(void) { gl_FragColor = vColor; }
