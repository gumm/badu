// rollup.config.js

export default [
  {
    input: 'src/badu.js',
    output: {
      file: 'badu.js',
      format: 'es',
      name: 'badu',
    }
  },
  {
    input: 'src/badu.js',
    output: {
      file: 'dist/_temp.js',
      format: 'iife',
      name: 'badu',
    },
  }
];