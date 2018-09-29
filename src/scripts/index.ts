import './common/initializer';
import '../styles/index.css';

import * as matIV from './modules/minMatrix';
import fragSource from './shaders/main.frag';
import vertSource from './shaders/main.vert';

type ShaderType = 'VERTEX' | 'FRAGMENT';

function setShader(gl: WebGLRenderingContext, source: string, type: ShaderType): WebGLShader {
  const shaderTypeText = type === 'VERTEX' ? 'VertexShader' : 'FragmentShader';
  const shaderType = type === 'VERTEX' ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER;
  // シェーダーを作成
  const shader = gl.createShader(shaderType);
  if (!shader) {
    throw new Error(`Can NOT create ${shaderTypeText}.`);
  }

  // シェーダーとソースを紐づけ
  gl.shaderSource(shader, source);
  // シェーダーをコンパイル
  gl.compileShader(shader);

  // コンパイルにコケてたらエラー
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    throw new Error(`Can NOT compile ${shaderTypeText}.`);
  }

  return shader;
}

function createWebGLProgram(
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader,
): WebGLProgram {
  const program = gl.createProgram();

  if (!program) {
    throw new Error('Can NOT create WebGLProgram.');
  }

  // プログラムオブジェクトにシェーダを割り当て
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  // 2つのシェーダーをリンク
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
    throw new Error('Can NOT link WebGLProgram with shaders.');
  }

  // プログラムオブジェクト有効化
  gl.useProgram(program);
  return program;
}

function createVBO(gl: WebGLRenderingContext, data: number[]) {
  const vbo = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return vbo;
}

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

  // mMatrix はなんもしないのである
  const mMatrix = matIV.identify();
  const vMatrix = matIV.lookAt(
    // 原点から上に1うしろに3
    [0, 1, 3],
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
  const mvpMatrix = matIV.multiply(mMatrix, vpMatrix);
  // mvpMatrixのインデックスを取得
  const uniformLocation = gl.getUniformLocation(webglProgram, 'mvpMatrix');
  // 頂点シェーダにデータを受け渡す
  // mat4なので、uniformMatrix4 数字いろいろある
  gl.uniformMatrix4fv(uniformLocation, false, mvpMatrix);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
  gl.flush();
});
