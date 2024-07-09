import * as esbuild from 'esbuild'
import * as fs from 'node:fs'

const ts = fs.readFileSync('./index.ts', 'utf-8')
const result = esbuild.buildSync({
    stdin: {
        contents: ts,
        loader: 'ts',
        resolveDir: '.',
    },
    bundle: true,
    write: false,
    format: 'esm',
    minify: true,
    treeShaking: true,
    keepNames: false,
})

console.log(result.outputFiles[0].text)
esbuild.stop()
