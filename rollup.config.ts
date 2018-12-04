import sourceMaps from 'rollup-plugin-sourcemaps'
import typescript from 'rollup-plugin-typescript2'
const pkg = require('./package.json')

module.exports = {
  input: 'src/index.ts',
  output: [
    { file: pkg.main, name: 'chineseNumerals', format: 'umd', sourcemap: true }
  ],
  external: [],
  watch: {
    include: 'src/**',
  },
  plugins: [
    typescript({ useTsconfigDeclarationDir: false }),
    sourceMaps()
  ]
}