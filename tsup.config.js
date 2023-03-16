export default {
  entryPoints: ['./src/main.ts'],
  format: ['cjs', 'esm'],
  minify: false,
  sourcemap: false,
  outDir: './dist',
  dts: true,
  dtsBundleOutFile: 'types.d.ts',
  dtsBundle: true,
  clean: true,
}