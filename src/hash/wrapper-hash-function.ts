import { HashFunction, KHash, TableBins } from '../types';
/**
 * letious hash-functions, inspired by https://www.partow.net/programming/hashfunctions/#JSHashFunction
 */
export function wrapperHashFunction(hashFunctions: HashFunction[]): KHash {
  const hashInt = (num: number, idx: number): number => {
    const str: string = num.toString();
    const hashLength: number = hashFunctions.length;
    const index = idx < hashLength ? idx : idx % hashLength;
    return hashFunctions[index](str);
  };

  //compatibility with k-hash,  murmur: (str: string, seed?: number)
  const murmur = (str: string, idx: number): number => {
    const hashLength: number = hashFunctions.length;
    const index = idx < hashLength ? idx : idx % hashLength;
    return hashFunctions[index](str);
  };

  return function (key, bins): TableBins {
    const DOUBLE_BUFFER = new Float64Array(1);
    const INT_VIEW = new Uint32Array(DOUBLE_BUFFER.buffer);

    const binsLength: number = bins.length;

    if (typeof key === 'number') {
      if (Number.isInteger(key)) {
        let b = hashInt(key, 0);
        bins[0] = b;
        for (let i = 1; i < binsLength; ++i) {
          b = hashInt(b, i);
          bins[i] = b;
        }
      } else {
        DOUBLE_BUFFER[0] = key;
        let b = hashInt(INT_VIEW[0] + hashInt(INT_VIEW[1], 0), 0);
        bins[0] = b;
        for (let i = 1; i < binsLength; ++i) {
          b = hashInt(b, i);
          bins[i] = b;
        }
      }
    } else if (typeof key === 'string') {
      for (let i = 0; i < binsLength; ++i) {
        bins[i] = murmur(key, i);
      }
    } else if (typeof key === 'object') {
      const str: string = JSON.stringify(key);
      for (let i = 0; i < binsLength; ++i) {
        bins[i] = murmur(str, i);
      }
    } else {
      const str = `${key}`;
      for (let i = 0; i < binsLength; ++i) {
        bins[i] = murmur(str, i);
      }
    }
    return bins;
  };
}
