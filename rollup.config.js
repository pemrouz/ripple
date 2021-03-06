import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import async from 'rollup-plugin-async';
import buble from 'rollup-plugin-buble'

export default {
  input: 'client/ripple.js'
, output: { 
    file: 'client/ripple.bundle.js' 
  , format: 'iife'
  } 
, name: 'rijs'
, plugins: [
    nodeResolve({ browser: true })
  , commonjs({ ignoreGlobal: true })
  , async()
  , buble({ 
      transforms: { 
        generator: false
      , classes: false 
      }
    })
  ]
}