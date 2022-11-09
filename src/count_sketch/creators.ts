import { CountMinSketch } from './count-min-sketch';
import { kHash } from '../hash';
import { KHash } from '../types';

/**
 *
 * @param algrithmWidth
 * @param numberOfHashFunctions
 * @param hashFunc
 * @returns `CountMinSketch`
 */
export const createCountMinSketch = (
  algrithmWidth: number,
  numberOfHashFunctions: number,
  hashFunc: KHash,
): CountMinSketch => {
  hashFunc = hashFunc || kHash;
  const width = algrithmWidth;
  const depth = numberOfHashFunctions;
  return new CountMinSketch(width, depth, hashFunc);
};
/**
 *
 * @returns `CountMinSketch`
 */
export function createCountMin(): CountMinSketch {
  const accuracy = 0.1;
  const probIncorrect = 0.0001;
  const hashFunc: KHash = kHash;
  const width: number = Math.ceil(Math.E / accuracy) | 0;
  const depth: number = Math.ceil(-Math.log(probIncorrect)) | 0;
  return new CountMinSketch(width, depth, hashFunc);
}
