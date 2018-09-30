import './common/initializer';
import '../styles/index.css';

import createVBO from './modules/createVBO';
import createWebGLProgram from './modules/createWebGLProgram';
import * as matIV from './modules/minMatrix';
import setShader from './modules/setShader';
import toRadian from './modules/toRadian';
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
    [0, 0, 5],
    [0, 0, 0],
    // カメラの上をY軸に固定、という意味らしい
    [0, 1, 0],
  );
  const pMatrix = matIV.perspective(
    // 視野角
    45,
    // アス比 もとのまま
    canvas.width / canvas.height,
    0.1,
    100,
  );
  const vpMatrix = matIV.multiply(pMatrix, vMatrix);
  const uniformLocation = gl.getUniformLocation(webglProgram, 'mvpMatrix'); // mvpMatrixのインデックスを取得
  const renderer = (mMatrix: matIV.Matrix) => {
    const mvpMatrix = matIV.multiply(vpMatrix, mMatrix);
    gl.uniformMatrix4fv(uniformLocation, false, mvpMatrix);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  let count = 0;
  const animation = () => {
    count += 1;

    // canvas初期化
    gl.clearColor(0, 0, 0, 1);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // tslint:disable-line

    const radian = toRadian(count % 360);

    // モデル1は円の軌道を描き移動する
    const positionA = {
      x: Math.cos(radian),
      y: Math.sin(radian),
    };
    const mMatrixA = matIV.translate(matIV.identify(), [positionA.x, positionA.y, 0.0]);
    renderer(mMatrixA);

    // モデル2はY軸を中心に回転する
    let mMatrixB = matIV.translate(matIV.identify(), [0.5, -0.5, 0.0]);
    mMatrixB = matIV.rotate(mMatrixB, radian, [0, 1, 0]);
    renderer(mMatrixB);

    // モデル3は拡大縮小する
    const scale = Math.abs(Math.sin(radian));
    let mMatrixC = matIV.translate(matIV.identify(), [-1.0, -1.2, 0.0]);
    mMatrixC = matIV.scale(mMatrixC, [scale, scale, 0.0]);
    renderer(mMatrixC);

    gl.flush();
    requestAnimationFrame(animation);
  };
  requestAnimationFrame(animation);
});
