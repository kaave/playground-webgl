import './common/initializer';
import '../styles/index.css';

import createVBO from './modules/createVBO';
import createWebGLProgram from './modules/createWebGLProgram';
import * as matIV from './modules/minMatrix';
import setShader from './modules/setShader';
import fragSource from './shaders/main.frag';
import vertSource from './shaders/main.vert';

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('canvas');
  if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
    return;
  }

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) {
    return;
  }

  gl.clearColor(0, 0, 0, 1);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // tslint:disable-line

  const vertexShader = setShader(gl, vertSource, 'VERTEX');
  const fragmentShader = setShader(gl, fragSource, 'FRAGMENT');
  const webglProgram = createWebGLProgram(gl, vertexShader, fragmentShader);
  const attributeLocations = {
    position: gl.getAttribLocation(webglProgram, 'position'), // main.vertの`attribute position`のインデックスを取得
    color: gl.getAttribLocation(webglProgram, 'color'), // main.vertの`attribute color`のインデックスを取得
  };
  const attributeStrides = {
    position: 3, // vec3の3
    color: 4, // vec4の4
  };
  const vertexPosition = [[0, 1, 0], [1, 0, 0], [-1, 0, 0]].reduce((tmp, ary) => [...tmp, ...ary], []);
  const positionVBO = createVBO(gl, vertexPosition);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionVBO);
  gl.enableVertexAttribArray(attributeLocations.position);
  gl.vertexAttribPointer(attributeLocations.position, attributeStrides.position, gl.FLOAT, false, 0, 0);

  const vertexColor = [[1, 1, 0, 1], [0, 1, 1, 1], [1, 0, 1, 1]].reduce((tmp, ary) => [...tmp, ...ary], []);
  const colorVBO = createVBO(gl, vertexColor);
  gl.bindBuffer(gl.ARRAY_BUFFER, colorVBO);
  gl.enableVertexAttribArray(attributeLocations.color);
  gl.vertexAttribPointer(attributeLocations.color, attributeStrides.color, gl.FLOAT, false, 0, 0);

  const vMatrix = matIV.lookAt(
    // 原点から上に1うしろに3
    [0, 0, 3],
    [0, 0, 0],
    // カメラの上をY軸に固定、という意味らしい
    [0, 1, 0],
  );
  const pMatrix = matIV.perspective(
    // 視野角
    90,
    // アス比 もとのまま
    canvas.width / canvas.height,
    0.1,
    100,
  );
  const vpMatrix = matIV.multiply(pMatrix, vMatrix);
  const uniformLocation = gl.getUniformLocation(webglProgram, 'mvpMatrix'); // mvpMatrixのインデックスを取得
  // 複数表示してみる
  // モデル変換の処理を追加するだけでいける そりゃそうだな
  [...Array(30).keys()].forEach(index => {
    const mMatrix = matIV.translate(matIV.identify(), [
      (index % 5) / 5 - 0.5,
      (Math.floor(index / 6) % 5) / 5 - 0.5,
      0,
    ]);
    const mvpMatrix = matIV.multiply(mMatrix, vpMatrix);
    // 頂点シェーダにデータを受け渡す
    // mat4なので、uniformMatrix4 数字いろいろある
    gl.uniformMatrix4fv(uniformLocation, false, mvpMatrix);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  });

  gl.flush();
});
