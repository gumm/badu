// rollup.config.js

export default [
  {
    input: 'module/badu.mjs',
    output: {
      file: 'main.js',
      format: 'cjs',
      name: 'badu',
    }
  }
];