// rollup.config.js

export default [
  {
    input: 'module/badu.jsm',
    output: {
      file: 'main.js',
      format: 'cjs',
      name: 'badu',
    }
  }
];