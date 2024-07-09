import { CallFrame } from '@/runtime/callFrame'
import { Scope } from '@/runtime/scope'
import { BreakSignal } from '@/runtime/signals'
import { Executable } from './base'
import { Block } from './block'

export class Loop extends Executable {
    constructor(public body: Block) {
        super()
    }

    execute(scope: Scope, _callFrame: CallFrame) {
        const callFrame = new CallFrame(this, _callFrame)

        try {
            while (true) {
                this.body.execute(scope, callFrame)
            }
        } catch (e) {
            if (!(e instanceof BreakSignal)) {
                throw e
            }
        }
    }
}

export class Break extends Executable {
    execute(_scope: Scope, _callFrame: CallFrame) {
        throw new BreakSignal(this.position)
    }
}
