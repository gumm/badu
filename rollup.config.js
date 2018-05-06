// rollup.config.js

export default [
  {
    input: 'src/badu.js',
    output: {
      file: 'main.js',
      format: 'cjs',
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