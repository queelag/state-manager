import typescript from '@rollup/plugin-typescript'
import { terser } from 'rollup-plugin-terser'

export default {
  external: ['@aracna/core'],
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.cjs',
      format: 'cjs'
    },
    {
      dir: 'dist',
      preserveModules: true,
      format: 'esm'
    }
  ],
  plugins: [terser(), typescript()]
}
