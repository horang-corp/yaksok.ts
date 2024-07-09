import { Scope } from '@/runtime/scope'
import { CallFrame } from '@/runtime/callFrame'

import { Evaluable, ValueTypes } from './base'

export abstract class IndexedValue extends Evaluable {
    abstract getItem(
        index: ValueTypes,
        scope: Scope,
        callFrame: CallFrame,
    ): ValueTypes
    abstract setItem(
        index: ValueTypes,
        value: ValueTypes,
        scope: Scope,
        callFrame: CallFrame,
    ): void
}
