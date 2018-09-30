type ShaderType = 'VERTEX' | 'FRAGMENT';

export default function setShader(gl: WebGLRenderingContext, source: string, type: ShaderType): WebGLShader {
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
