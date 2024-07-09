import { NotEnumerableValueForListLoopError } from '@/error'
import { CallFrame } from '@/runtime/callFrame'
import { Scope } from '@/runtime/scope'
import { BreakSignal } from '@/runtime/signals'
import { Evaluable, Executable } from './base'
import { Block } from './block'
import { List } from './list'

export class ListLoop extends Executable {
    constructor(
        public list: Evaluable,
        public variableName: string,
        public body: Block,
    ) {
        super()
    }

    execute(_scope: Scope, _callFrame: CallFrame): void {
        const scope = new Scope({
            parent: _scope,
        })
        const callFrame = new CallFrame(this, _callFrame)

        const list = this.list
            .execute(scope, callFrame)

        this.assertRepeatTargetIsList(list)

        try {
            for (const value of list.evaluatedItems!) {
                scope.setVariable(this.variableName, value)
                this.body.execute(scope, callFrame)
            }
        } catch (e) {
            if (!(e instanceof BreakSignal)) throw e
        }
    }

    assertRepeatTargetIsList(target: Evaluable): asserts target is List {
        if (target instanceof List) return

        throw new NotEnumerableValueForListLoopError({
            resource: {
                value: target,
            },
            position: this.position,
        })
    }
}
