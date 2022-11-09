import { hashInt } from './hash-int';
import { hash3_32 } from '.';

import { KHash } from '../types';

/** Hashes key into a collection of different bins. Each value in bins is a 32-bit unsigned integer
 * @param {number} key  is the key to hash
 * @param {string} bins  is an array of values which get the output of the hash
 * @return Hash typed array version
 * @return Hash untyped array version
 */
export let kHash: KHash;

if (typeof Float64Array !== 'undefined') {
  //Typed array version
  const DOUBLE_BUFFER: Float64Array = new Float64Array(1);
  const INT_VIEW: Uint32Array = new Uint32Array(DOUBLE_BUFFER.buffer);

  kHash = (key, bins): number[] | Uint32Array => {
    /** bins length*/
    const binsLength: number = bins.length;
    if (typeof key === 'number') {
      if (key | 0) {
        let bit = hashInt(key);
        bins[0] = bit;
        for (let i = 1; i < binsLength; ++i) {
          bit = hashInt(bit);
          bins[i] = bit;
        }
        return bins;
      } else {
        DOUBLE_BUFFER[0] = key;
        let b = hashInt(INT_VIEW[0] + hashInt(INT_VIEW[1]));
        bins[0] = b;
        for (let i = 1; i < binsLength; ++i) {
          b = hashInt(b);
          bins[i] = b;
        }
        return bins;
      }
    } else if (typeof key === 'string') {
      for (let i = 0; i < binsLength; ++i) {
        bins[i] = hash3_32(key, i);
      }
    } else if (typeof key === 'object') {
      let str;
      if (key.toString) {
        str = key.toString();
      } else {
        str = JSON.stringify(key);
      }
      for (let i = 0; i < binsLength; ++i) {
        bins[i] = hash3_32(str, i);
      }
      return bins;
    } else {
      const str = `${key}`;
      for (let i = 0; i < binsLength; ++i) {
        bins[i] = hash3_32(str, i);
      }
      return bins;
    }
    return bins;
  };
} else {
  /**
   * Hash untyped array version
   */
  kHash = (key, bins): number[] | Uint32Array => {
    const binsLength: number = bins.length;

    if (typeof key === 'number') {
      if (key | 0) {
        let b = hashInt(key);
        bins[0] = b;
        for (let i = 0; i < binsLength; ++i) {
          b = hashInt(b);
          bins[i] = b;
        }
        return bins;
      }
    } else if (typeof key === 'string') {
      for (let i = 0; i < binsLength; ++i) {
        bins[i] = hash3_32(key, i);
      }
      return bins;
    } else if (typeof key === 'object') {
      let str: string;

      if (key.toString) str = key.toString();
      else str = JSON.stringify(key);

      for (let i = 0; i < binsLength; ++i) {
        bins[i] = hash3_32(str, i);
      }
      return bins;
    }

    const str = `${key}`;

    for (let i = 0; i < binsLength; ++i) {
      bins[i] = hash3_32(str, i);
    }
    return bins;
  };
}
