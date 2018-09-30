import deepcopy from 'deepcopy/cjs/index';

export type Matrix = Float32Array;
export type Vertex2 = [number, number];
export type Vertex3 = [number, number, number];
export type Vertex4 = [number, number, number, number];

export function createMatrix(): Matrix {
  return new Float32Array(16);
}

export function identify(): Matrix {
  const matrix = createMatrix();
  matrix[0] = 1;
  matrix[1] = 0;
  matrix[2] = 0;
  matrix[3] = 0;
  matrix[4] = 0;
  matrix[5] = 1;
  matrix[6] = 0;
  matrix[7] = 0;
  matrix[8] = 0;
  matrix[9] = 0;
  matrix[10] = 1;
  matrix[11] = 0;
  matrix[12] = 0;
  matrix[13] = 0;
  matrix[14] = 0;
  matrix[15] = 1;
  return matrix;
}

export function multiply(matrixA: Matrix, matrixB: Matrix): Matrix {
  const [a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p] = matrixA;
  const [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P] = matrixB;
  const matrix = createMatrix();
  matrix[0] = A * a + B * e + C * i + D * m;
  matrix[1] = A * b + B * f + C * j + D * n;
  matrix[2] = A * c + B * g + C * k + D * o;
  matrix[3] = A * d + B * h + C * l + D * p;
  matrix[4] = E * a + F * e + G * i + H * m;
  matrix[5] = E * b + F * f + G * j + H * n;
  matrix[6] = E * c + F * g + G * k + H * o;
  matrix[7] = E * d + F * h + G * l + H * p;
  matrix[8] = I * a + J * e + K * i + L * m;
  matrix[9] = I * b + J * f + K * j + L * n;
  matrix[10] = I * c + J * g + K * k + L * o;
  matrix[11] = I * d + J * h + K * l + L * p;
  matrix[12] = M * a + N * e + O * i + P * m;
  matrix[13] = M * b + N * f + O * j + P * n;
  matrix[14] = M * c + N * g + O * k + P * o;
  matrix[15] = M * d + N * h + O * l + P * p;
  return matrix;
}

export function scale(matrix: Matrix, vector: Vertex3): Matrix {
  const result = createMatrix();

  result[0] = matrix[0] * vector[0];
  result[1] = matrix[1] * vector[0];
  result[2] = matrix[2] * vector[0];
  result[3] = matrix[3] * vector[0];
  result[4] = matrix[4] * vector[1];
  result[5] = matrix[5] * vector[1];
  result[6] = matrix[6] * vector[1];
  result[7] = matrix[7] * vector[1];
  result[8] = matrix[8] * vector[2];
  result[9] = matrix[9] * vector[2];
  result[10] = matrix[10] * vector[2];
  result[11] = matrix[11] * vector[2];
  result[12] = matrix[12];
  result[13] = matrix[13];
  result[14] = matrix[14];
  result[15] = matrix[15];

  return result;
}

export function translate(matrix: Matrix, vector: Vertex3): Matrix {
  const result = createMatrix();
  result[0] = matrix[0];
  result[1] = matrix[1];
  result[2] = matrix[2];
  result[3] = matrix[3];
  result[4] = matrix[4];
  result[5] = matrix[5];
  result[6] = matrix[6];
  result[7] = matrix[7];
  result[8] = matrix[8];
  result[9] = matrix[9];
  result[10] = matrix[10];
  result[11] = matrix[11];
  result[12] = matrix[0] * vector[0] + matrix[4] * vector[1] + matrix[8] * vector[2] + matrix[12];
  result[13] = matrix[1] * vector[0] + matrix[5] * vector[1] + matrix[9] * vector[2] + matrix[13];
  result[14] = matrix[2] * vector[0] + matrix[6] * vector[1] + matrix[10] * vector[2] + matrix[14];
  result[15] = matrix[3] * vector[0] + matrix[7] * vector[1] + matrix[11] * vector[2] + matrix[15];

  return result;
}

export function rotate(matrix: Matrix, angle: number, axis: Vertex3): Matrix {
  let sq = Math.sqrt(axis[0] * axis[0] + axis[1] * axis[1] + axis[2] * axis[2]);
  if (!sq) {
    return matrix;
  }

  let [a, b, c] = axis;
  if (sq !== 1) {
    sq = 1 / sq;
    a *= sq;
    b *= sq;
    c *= sq;
  }

  const d = Math.sin(angle);
  const e = Math.cos(angle);
  const f = 1 - e;
  const [g, h, i, j, k, l, m, n, o, p, q, r] = matrix;
  const s = a * a * f + e;
  const t = b * a * f + c * d;
  const u = c * a * f - b * d;
  const v = a * b * f - c * d;
  const w = b * b * f + e;
  const x = c * b * f + a * d;
  const y = a * c * f + b * d;
  const z = b * c * f - a * d;
  const A = c * c * f + e;

  const result = !angle ? deepcopy(matrix) : createMatrix();
  if (angle && matrix !== result) {
    result[12] = matrix[12];
    result[13] = matrix[13];
    result[14] = matrix[14];
    result[15] = matrix[15];
  }

  result[0] = g * s + k * t + o * u;
  result[1] = h * s + l * t + p * u;
  result[2] = i * s + m * t + q * u;
  result[3] = j * s + n * t + r * u;
  result[4] = g * v + k * w + o * x;
  result[5] = h * v + l * w + p * x;
  result[6] = i * v + m * w + q * x;
  result[7] = j * v + n * w + r * x;
  result[8] = g * y + k * z + o * A;
  result[9] = h * y + l * z + p * A;
  result[10] = i * y + m * z + q * A;
  result[11] = j * y + n * z + r * A;

  return result;
}

export function lookAt(eye: Vertex3, center: Vertex3, up: Vertex3): Matrix {
  const [eyeX, eyeY, eyeZ] = eye;
  const [centerX, centerY, centerZ] = center;

  if (eyeX === centerX && eyeY === centerY && eyeZ === centerZ) {
    return identify();
  }

  const [upX, upY, upZ] = up;
  const tmpZ0 = eyeX - center[0];
  const tmpZ1 = eyeY - center[1];
  const tmpZ2 = eyeZ - center[2];
  let l = 1 / Math.sqrt(tmpZ0 * tmpZ0 + tmpZ1 * tmpZ1 + tmpZ2 * tmpZ2);
  const z0 = tmpZ0 * l;
  const z1 = tmpZ1 * l;
  const z2 = tmpZ2 * l;
  const tmpX0 = upY * z2 - upZ * z1;
  const tmpX1 = upZ * z0 - upX * z2;
  const tmpX2 = upX * z1 - upY * z0;
  l = Math.sqrt(tmpX0 * tmpX0 + tmpX1 * tmpX1 + tmpX2 * tmpX2);
  const [x0, x1, x2] = !l ? [0, 0, 0] : [tmpX0, tmpX1, tmpX2].map(tmpX => tmpX * (1 / l));
  const tmpY0 = z1 * x2 - z2 * x1;
  const tmpY1 = z2 * x0 - z0 * x2;
  const tmpY2 = z0 * x1 - z1 * x0;
  l = Math.sqrt(tmpY0 * tmpY0 + tmpY1 * tmpY1 + tmpY2 * tmpY2);
  const [y0, y1, y2] = !l ? [0, 0, 0] : [tmpY0, tmpY1, tmpY2].map(tmpY => tmpY * (1 / l));

  const result = createMatrix();
  result[0] = x0;
  result[1] = y0;
  result[2] = z0;
  result[3] = 0;
  result[4] = x1;
  result[5] = y1;
  result[6] = z1;
  result[7] = 0;
  result[8] = x2;
  result[9] = y2;
  result[10] = z2;
  result[11] = 0;
  result[12] = -(x0 * eyeX + x1 * eyeY + x2 * eyeZ);
  result[13] = -(y0 * eyeX + y1 * eyeY + y2 * eyeZ);
  result[14] = -(z0 * eyeX + z1 * eyeY + z2 * eyeZ);
  result[15] = 1;
  return result;
}

export function perspective(fovy: number, aspect: number, near: number, far: number): Matrix {
  const t = near * Math.tan((fovy * Math.PI) / 360);
  const r = t * aspect;
  const a = r * 2;
  const b = t * 2;
  const c = far - near;

  const result = createMatrix();
  result[0] = (near * 2) / a;
  result[1] = 0;
  result[2] = 0;
  result[3] = 0;
  result[4] = 0;
  result[5] = (near * 2) / b;
  result[6] = 0;
  result[7] = 0;
  result[8] = 0;
  result[9] = 0;
  result[10] = -(far + near) / c;
  result[11] = -1;
  result[12] = 0;
  result[13] = 0;
  result[14] = -(far * near * 2) / c;
  result[15] = 0;
  return result;
}

export function transpose(matrix: Matrix): Matrix {
  const result = createMatrix();
  result[0] = matrix[0];
  result[1] = matrix[4];
  result[2] = matrix[8];
  result[3] = matrix[12];
  result[4] = matrix[1];
  result[5] = matrix[5];
  result[6] = matrix[9];
  result[7] = matrix[13];
  result[8] = matrix[2];
  result[9] = matrix[6];
  result[10] = matrix[10];
  result[11] = matrix[14];
  result[12] = matrix[3];
  result[13] = matrix[7];
  result[14] = matrix[11];
  result[15] = matrix[15];
  return result;
}

export function inverse(matrix: Matrix): Matrix {
  const [a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p] = matrix;
  const q = a * f - b * e;
  const r = a * g - c * e;
  const s = a * h - d * e;
  const t = b * g - c * f;
  const u = b * h - d * f;
  const v = c * h - d * g;
  const w = i * n - j * m;
  const x = i * o - k * m;
  const y = i * p - l * m;
  const z = j * o - k * n;
  const A = j * p - l * n;
  const B = k * p - l * o;
  const ivd = 1 / (q * B - r * A + s * z + t * y - u * x + v * w);
  const result = createMatrix();
  result[0] = (f * B - g * A + h * z) * ivd;
  result[1] = (-b * B + c * A - d * z) * ivd;
  result[2] = (n * v - o * u + p * t) * ivd;
  result[3] = (-j * v + k * u - l * t) * ivd;
  result[4] = (-e * B + g * y - h * x) * ivd;
  result[5] = (a * B - c * y + d * x) * ivd;
  result[6] = (-m * v + o * s - p * r) * ivd;
  result[7] = (i * v - k * s + l * r) * ivd;
  result[8] = (e * A - f * y + h * w) * ivd;
  result[9] = (-a * A + b * y - d * w) * ivd;
  result[10] = (m * u - n * s + p * q) * ivd;
  result[11] = (-i * u + j * s - l * q) * ivd;
  result[12] = (-e * z + f * x - g * w) * ivd;
  result[13] = (a * z - b * x + c * w) * ivd;
  result[14] = (-m * t + n * r - o * q) * ivd;
  result[15] = (i * t - j * r + k * q) * ivd;
  return result;
}
