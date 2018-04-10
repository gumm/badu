// rollup.config.js

export default [
  {
    input: 'module/badu.mjs',
    output: {
      file: 'main.js',
      format: 'cjs',
      name: 'badu',
    }
  },
  {
    input: 'module/badu.mjs',
    output: {
      file: 'dist/_temp.js',
      format: 'iife',
      name: 'badu',
    },
  }
];