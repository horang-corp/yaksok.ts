import { Node } from '@/node'

export class CallFrame {
    event: Record<string, (...args: any[]) => void> = {}
    constructor(
        public node: Node,
        public parent?: CallFrame | undefined,
    ) {}
}
