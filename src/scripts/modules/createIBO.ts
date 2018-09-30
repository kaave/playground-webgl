export default function createIBO(gl: WebGLRenderingContext, data: number[]) {
  const ibo = gl.createBuffer();
  // VBOと比べて、ELEMENT_ARRAY_BUFFERになった
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
  // VBOと比べて、Int16Arrayになった
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(data), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  console.log(ibo);

  return ibo;
}
