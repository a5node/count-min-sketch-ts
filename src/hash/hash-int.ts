import { HashInt } from '../types';

/** Creates a number based on the given number
 * @param {number} int Getting a numeric value.
 * @return Returns a ten digit number
 * @exempla
 * ```ts
 * import { hashInt } from './hash/hash-int';
 * console.log(hashInt(12222213123));
 * //2258088588
 * ```
 */
export const hashInt: HashInt = (int: number): number => {
  let A: number[] | Uint32Array;
  if (typeof Uint32Array === undefined) A = [0];
  else A = new Uint32Array(1);

  A[0] = int | 0;
  A[0] -= A[0] << 6;
  A[0] ^= A[0] >>> 17;
  A[0] -= A[0] << 9;
  A[0] ^= A[0] << 4;
  A[0] -= A[0] << 3;
  A[0] ^= A[0] << 10;
  A[0] ^= A[0] >>> 15;
  return A[0];
};
