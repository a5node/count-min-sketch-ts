/* eslint-disable @typescript-eslint/ban-types */
/**
 * TypeScript realization of Count-Min-Sketch data structured, inspired by https://github.com/mikolalysenko/count-min-sketch
 */
import * as defaultHash from "k-hash";
import { wrapperHashFunction } from "./hashes";

"use strict"

function CountMinSketch(width, depth, hashFunc: Function) {
  this.width = width
  this.depth = depth
  this.hashFunc = hashFunc as Function
  this.table = new Uint32Array(width * depth)
  this.scratch = new Uint32Array(depth)
}

const proto = CountMinSketch.prototype

proto.hashFunc = function(key, scratch){
    return this.hashFunc
}

proto.toJSON = function() {
  return {
    width: this.width,
    depth: this.depth,
    table: Array.prototype.slice.call(this.table)
  }
}

proto.fromJSON = function(data) {
  if (typeof data == 'string') {
    data = JSON.parse(data)
  }
  if (!(data.width && data.depth && data.table)) {
    throw new Error('Cannot reconstruct the filter with a partial object')
  }
  const n = data.width * data.depth
  let table = this.table
  if(table.length > n) {
    table = table.subarray(0, n)
  } else if(table.length < n) {
    table = new Uint32Array(n)
  }
  const input_table = data.table
  for(let i=0; i<n; ++i) {
    table[i] = input_table[i]
  }
  if(this.scratch.length > data.depth) {
    this.scratch = this.scratch.subarray(0, data.depth)
  } else if(this.scratch.length < data.depth) {
    this.scratch = new Uint32Array(data.depth)
  }
  this.width = data.width|0
  this.depth = data.depth|0
  this.table = table
  return this
}

proto.update = function(key) {
  const d = this.depth
  const w = this.width
  const tab = this.table
  let ptr = 0
  proto.hashFunc(key, this.scratch)
  for(let i=0; i<d; ++i) {
    tab[ptr + (this.scratch[i] % w)] += 1
    ptr += w
  }
}
  
proto.query = function(key) {
    const d = this.depth
    const w = this.width
    const tab = this.table
    let ptr = w
  proto.hashFunc(key, this.scratch)
  let r = tab[this.scratch[0]%w]
  for(let i=1; i<d; ++i) {
    r = Math.min(r, tab[ptr + (this.scratch[i]%w)])
    ptr += w
  }
  return r
}

export function createCountMinSketch(algrithmWidth, numberOfHashFunctions, hashFuncs) {
  const hashFunc: Function = hashFuncs ? wrapperHashFunction[hashFuncs] : defaultHash
  const width = algrithmWidth
  const depth = numberOfHashFunctions
  return new CountMinSketch(width, depth, hashFunc)
}

export function createCountMin() {
    const accuracy = 0.1
    const probIncorrect = 0.0001
    const hashFunc = defaultHash
    const width = Math.ceil(Math.E / accuracy)|0
    const depth = Math.ceil(-Math.log(probIncorrect))|0
    return new CountMinSketch(width, depth, hashFunc)
  }