import { CountMinSketch } from './count-min-sketch';
import { APHash, DEKHash, DJBHash, JSHash, SDBMHash, wrapperHashFunction } from '../hash';
import { CreateCountMin, CreateCountMinSketch, HashFunction, WrapperHashFunc } from '../types';

/** Create `count min sketch`
 * @param algrithmWidth - The width of a algorithms
 * @param numberOfHashFunctions - The func number  for data encoding
 * @param hashFunc - The list hashFunction `[ELFHash, JSHash, SDBMHash, DJBHash, DEKHash, APHash]`
 * @returns `CountMinSketch`
 */
export const createCountMinSketch: CreateCountMinSketch = (
  algrithmWidth: number,
  numberOfHashFunctions: number,
  hashFunc: HashFunction[],
): CountMinSketch => {
  let func: WrapperHashFunc;

  if (hashFunc.length < 1) func = wrapperHashFunction(hashFunc);
  else func = wrapperHashFunction([APHash, JSHash, SDBMHash, DJBHash, DEKHash, APHash]);

  const width = algrithmWidth;
  const depth = numberOfHashFunctions;
  return new CountMinSketch(width, depth, func);
};

/** Create default `count min sketch`
 * @returns `CountMinSketch`
 */
export const createCountMin: CreateCountMin = (): CountMinSketch => {
  const accuracy = 0.1;
  const probIncorrect = 0.0001;
  const hashFunc: WrapperHashFunc = wrapperHashFunction([APHash, JSHash, SDBMHash, DJBHash, DEKHash, APHash]);
  const width: number = Math.ceil(Math.E / accuracy) | 0;
  const depth: number = Math.ceil(-Math.log(probIncorrect)) | 0;
  return new CountMinSketch(width, depth, hashFunc);
};
