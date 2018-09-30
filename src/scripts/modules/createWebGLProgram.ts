export default function createWebGLProgram(
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
