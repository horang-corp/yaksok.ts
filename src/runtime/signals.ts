import { Position } from '@/node'

export class Signal {
    constructor(public position?: Position) {}
}

export class ReturnSignal extends Signal {}
export class BreakSignal extends Signal {}
