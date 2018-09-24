attribute vec3 position;  // attributeという修飾子付きで宣言された変数が頂点情報の引き渡し用変数となる
uniform mat4 mvpMatrix;  // uniformという修飾子ですべての頂点に対して一律に処理される情報を渡せる

void main(void) { gl_Position = mvpMatrix * vec4(position, 1.0); }
