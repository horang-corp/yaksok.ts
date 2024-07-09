import { CallFrame } from '@/runtime/callFrame'
import { Scope } from '@/runtime/scope'
import { CannotParseError } from '@/error'
import { EOL } from './misc'
import { Executable, Node } from './base'

export class Block extends Executable {
    children: Node[]

    constructor(content: Node[]) {
        super()
        this.children = content
    }

    execute(scope: Scope, _callFrame: CallFrame) {
        const callFrame = new CallFrame(this, _callFrame)

        for (const child of this.children) {
            if (child instanceof Executable) {
                child.execute(scope, callFrame)
            } else if (child instanceof EOL) {
                continue
            } else {
                throw new CannotParseError({
                    position: child.position,
                    resource: {
                        part: child,
                    },
                })
            }
        }
    }
}
