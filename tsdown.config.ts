import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: { index: 'src/main.ts' },
  outDir: 'dist',
  format: ['cjs'],
  platform: 'node',
  target: 'node24',
  clean: true,
  noExternal: [/.*/],
})
