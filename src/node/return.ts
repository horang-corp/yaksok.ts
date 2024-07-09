import { Scope } from '@/runtime/scope'
import { ReturnSignal } from '@/runtime/signals'
import { Executable } from './base'

export class Return extends Executable {
    execute(_scope: Scope) {
        throw new ReturnSignal(this.position)
    }
}
