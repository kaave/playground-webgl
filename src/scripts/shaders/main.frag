varying vec4 vColor; // 頂点シェーダから色情報を受取る

void main(void) {
  // ここで色情報を代入
  gl_FragColor = vColor;
}
