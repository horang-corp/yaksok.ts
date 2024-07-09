import { CallFrame } from '@/runtime/callFrame'
import { Scope } from '@/runtime/scope'

import { Node, Executable, Evaluable, Position } from './base'

export class EOL extends Node {
    constructor(public position?: Position) {
        super()
    }
}

export class Indent extends Node {
    constructor(public size: number, public position?: Position) {
        super()
    }
}

export class Print extends Executable {
    constructor(public value: Evaluable, public position?: Position) {
        super()
    }

    execute(scope: Scope, _callFrame: CallFrame) {
        const printFunction = scope.runtime?.stdout || console.log
        printFunction(this.value.execute(scope, _callFrame).toPrint())
    }
}
