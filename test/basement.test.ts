import { assertEquals, assertIsError, unreachable } from 'assert'

import { Evaluable, Executable, NumberValue, Operator } from '../src/node/index'
import { Scope } from '../src/runtime/scope'
import { CallFrame } from '../src/runtime/callFrame'

Deno.test('Basement Nodes are not executable', async (context) => {
    await context.step('Executable', () => {
        try {
            const node = new Executable()
            node.execute(new Scope(), new CallFrame(node))
            unreachable()
        } catch (error) {
            assertIsError(error)
            assertEquals(error.message, 'Executable has no execute method')
        }
    })

    await context.step('Evaluable', () => {
        try {
            const node = new Evaluable()
            node.execute(new Scope(), new CallFrame(node))
            unreachable()
        } catch (error) {
            assertIsError(error)
            assertEquals(error.message, 'Evaluable has no execute method')
        }
    })
})

Deno.test('Basement Nodes are not printable', async (context) => {
    await context.step('Executable', () => {
        try {
            const node = new Executable()
            node.toPrint()
            unreachable()
        } catch (error) {
            assertIsError(error)
            assertEquals(error.message, 'Executable has no toPrint method')
        }
    })

    await context.step('Evaluable', () => {
        try {
            const node = new Evaluable()
            node.toPrint()
            unreachable()
        } catch (error) {
            assertIsError(error)
            assertEquals(error.message, 'Evaluable has no toPrint method')
        }
    })
})

Deno.test('Operator base class has no implemented calc method', () => {
    try {
        const node = new Operator()
        node.call(new NumberValue(1), new NumberValue(2))
        unreachable()
    } catch (error) {
        assertIsError(error)
        assertEquals(error.message, 'Operator has no call method')
    }
})
