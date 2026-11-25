import * as esbuild from 'esbuild'

const watch = process.argv.includes('--watch')

const options = {
  entryPoints: ['src/client/index.js'],
  bundle: true,
  platform: 'browser',
  format: 'cjs',
  target: ['es2020'],
  outfile: 'client.js',
  external: ['react'],
  loader: { '.css': 'text' },
  charset: 'utf8',
  banner: {
    js: [
      '/* Generated from src/client/ — do not edit directly. Run `npm run build:client`. */',
      'window.__ModuleLoader__.load({',
      "  id: 'dsh-english-gym',",
      '  factory(require) {',
      '    var module = { exports: {} };',
      '    var exports = module.exports;',
    ].join('\n'),
  },
  footer: {
    js: [
      '    return module.exports;',
      '  },',
      '});',
    ].join('\n'),
  },
}

if (watch) {
  const ctx = await esbuild.context(options)
  await ctx.watch()
  console.log('[build-client] watching src/client/ -> client.js')
  const stop = async () => {
    await ctx.dispose()
    process.exit(0)
  }
  process.on('SIGINT', stop)
  process.on('SIGTERM', stop)
} else {
  const result = await esbuild.build({ ...options, metafile: true })
  const bytes = result.metafile?.outputs?.['client.js']?.bytes ?? 0
  console.log(`[build-client] wrote client.js (${bytes} bytes)`)
}
