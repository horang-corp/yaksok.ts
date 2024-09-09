import { FileForRunNotExistError, ErrorInModuleError, printError, YaksokError } from '@/error'
import { Block, Node, Evaluable, ValueTypes, Params } from '@/node'
import { tokenize } from '@/prepare/tokenize'
import { parse } from '@/prepare/parse'
import { Rule } from '@/prepare/parse/rule'
import { Scope } from '@/runtime/scope'
import { run } from '@/runtime/run'

interface YaksokConfig {
    stdout: (message: string) => void
    stderr: (message: string) => void
    entryPoint: string
    runFFI: (runtime: string, code: string, args: Params) => ValueTypes
}

const defaultConfig: YaksokConfig = {
    stdout: console.log,
    stderr: console.error,
    entryPoint: 'main',
    runFFI: (runtime: string) => {
        throw new Error(`FFI ${runtime} not implemented`)
    },
}

export class CodeRunner {
    functionDeclaration: Node[][] = []
    scope: Scope
    ast: Block
    exports: Rule[] = []

    constructor(
        private code: string,
        private runtime: Yaksok,
        private fileName: string,
    ) {
        this.scope = new Scope({
            runtime: this.runtime,
        })

        const token = tokenize(code)

        console.log(token)

        const parseResult = parse(tokenize(code), this.runtime)

        this.ast = parseResult.ast
        this.exports = parseResult.dynamicRules
    }

    run() {
        try {
            return run(this.ast, this.scope)
        } catch (error) {
            if (error instanceof YaksokError) {
                this.runtime.stderr(
                    printError({
                        code: this.code,
                        runtime: this,
                        error,
                    }),
                )
            }

            throw error
        }
    }

    evaluateFromExtern(node: Evaluable) {
        try {
            return run(node, this.scope)
        } catch (error) {
            if (error instanceof YaksokError) {
                this.runtime.stderr(
                    printError({
                        code: this.code,
                        runtime: this,
                        error,
                    }),
                )
            }

            throw new ErrorInModuleError({
                resource: {
                    fileName: this.fileName,
                },
                position: node.position,
            })
        }
    }
}

export class Yaksok implements YaksokConfig {
    stdout: YaksokConfig['stdout']
    stderr: YaksokConfig['stderr']
    entryPoint: YaksokConfig['entryPoint']
    runFFI: YaksokConfig['runFFI']

    runners: Record<string, CodeRunner> = {}
    ran: Record<string, boolean> = {}

    constructor(
        public files: Record<string, string>,
        config: Partial<YaksokConfig>,
    ) {
        this.stdout = config.stdout || defaultConfig.stdout
        this.stderr = config.stderr || defaultConfig.stderr
        this.entryPoint = config.entryPoint || defaultConfig.entryPoint
        this.runFFI = config.runFFI || defaultConfig.runFFI
    }

    getRunner(fileName = this.entryPoint) {
        if (!(fileName in this.files)) {
            throw new FileForRunNotExistError({
                resource: {
                    entryPoint: this.entryPoint,
                    files: Object.keys(this.files),
                },
            })
        }

        if (fileName in this.runners) {
            return this.runners[fileName]
        }

        this.runners[fileName] = new CodeRunner(
            this.files[fileName],
            this,
            fileName,
        )
        return this.runners[fileName]
    }

    run(fileName = this.entryPoint) {
        try {
            const runner = this.getRunner(fileName)
            return runner.run()
        } catch (error) {
            if (error instanceof YaksokError) {
                this.stderr(
                    printError({
                        code: this.files[fileName],
                        error,
                    }),
                )
            }

            throw error
        }
    }

    runOnce(fileName = this.entryPoint) {
        const runner = this.getRunner(fileName)
        if (!(fileName in this.ran)) runner.run()

        return runner
    }
}

export function yaksok(
    code: string | Record<string, string>,
    config: Partial<YaksokConfig> = {},
) {
    const yaksok = new Yaksok(
        typeof code === 'string'
            ? {
                [defaultConfig.entryPoint]: code,
            }
            : code,
        config,
    )

    yaksok.run()
    return yaksok
}

export default {
    Yaksok,
    yaksok,
    CodeRunner,
};

export * from './error';
export * from './node';
export * from './prepare/parse';
export * from './prepare/tokenize';
export * from './runtime';
