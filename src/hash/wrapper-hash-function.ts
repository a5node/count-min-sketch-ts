import { HashFunction, WrapperHashFunc, Scratch, HashKeyString, HashKeyNumber } from '../types';
/**
 * letious hash-functions, inspired by https://www.partow.net/programming/hashfunctions/#JSHashFunction
 */
export function wrapperHashFunction(hashFunctions: HashFunction[]): WrapperHashFunc {
  const hashInt: HashKeyNumber = (num: number, idx: number): number => {
    const str: string = num.toString();
    const hashLength: number = hashFunctions.length;
    const index = idx < hashLength ? idx : idx % hashLength;
    return hashFunctions[index](str);
  };

  //compatibility with k-hash,  murmur: (str: string, seed?: number)
  const murmur: HashKeyString = (str: string, idx: number): number => {
    const hashLength: number = hashFunctions.length;
    const index = idx < hashLength ? idx : idx % hashLength;
    return hashFunctions[index](str);
  };

  return function (key, scratch): Scratch {
    const DOUBLE_BUFFER = new Float64Array(1);
    const INT_VIEW = new Uint32Array(DOUBLE_BUFFER.buffer);

    const scratchLength: number = scratch.length;

    if (typeof key === 'number') {
      if (Number.isInteger(key)) {
        let b = hashInt(key, 0);
        scratch[0] = b;
        for (let i = 1; i < scratchLength; ++i) {
          b = hashInt(b, i);
          scratch[i] = b;
        }
      } else {
        DOUBLE_BUFFER[0] = key;
        let b = hashInt(INT_VIEW[0] + hashInt(INT_VIEW[1], 0), 0);
        scratch[0] = b;

        for (let i = 1; i < scratchLength; ++i) {
          b = hashInt(b, i);
          scratch[i] = b;
        }
      }
    } else if (typeof key === 'string') {
      for (let i = 0; i < scratchLength; ++i) {
        scratch[i] = murmur(key, i);
      }
    } else if (typeof key === 'object') {
      const str: string = JSON.stringify(key);

      for (let i = 0; i < scratchLength; ++i) {
        scratch[i] = murmur(str, i);
      }
    } else {
      for (let i = 0; i < scratchLength; ++i) {
        scratch[i] = murmur(`${key}`, i);
      }
    }
    return scratch;
  };
}
