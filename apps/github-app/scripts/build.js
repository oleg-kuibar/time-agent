const { build } = require('esbuild')
const { nodeExternalsPlugin } = require('esbuild-node-externals')
const { resolve } = require('path')

const ROOT_DIR = resolve(__dirname, '..')

build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node18',
  outdir: 'dist',
  sourcemap: true,
  plugins: [nodeExternalsPlugin()],
  absWorkingDir: ROOT_DIR,
  alias: {
    '@': resolve(ROOT_DIR, 'src'),
    '@lib': resolve(ROOT_DIR, 'src/lib'),
    '@config': resolve(ROOT_DIR, 'src/config'),
    '@constants': resolve(ROOT_DIR, 'src/constants'),
    '@domains': resolve(ROOT_DIR, 'src/domains'),
    '@schemas': resolve(ROOT_DIR, 'src/schemas'),
    '@services': resolve(ROOT_DIR, 'src/services'),
    '@types': resolve(ROOT_DIR, 'src/types')
  }
}).catch(() => process.exit(1)) 