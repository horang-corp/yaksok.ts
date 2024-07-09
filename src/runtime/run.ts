import {
    BreakNotInLoopError,
    CannotReturnOutsideFunctionError,
} from '@/error'
import { Executable } from '@/node'
import { Scope } from './scope'
import { CallFrame } from './callFrame'
import { BreakSignal, ReturnSignal } from './signals'

export function run<NodeType extends Executable>(
    node: NodeType,
    scope = new Scope(),
) {
    const callFrame = new CallFrame(node, undefined)

    try {
        return node.execute(scope, callFrame) as ReturnType<NodeType['execute']>
    } catch (e) {
        if (e instanceof ReturnSignal) {
            throw new CannotReturnOutsideFunctionError({
                position: e.position,
            })
        }

        if (e instanceof BreakSignal) {
            throw new BreakNotInLoopError({
                position: e.position,
            })
        }

        throw e
    }
}
