import { assertEquals } from 'assert'

import { NumberValue } from '../src/node/primitive'
import { yaksok } from '../src/index'

Deno.test('Operation with parenthesis', () => {
    const code = `
값1: (10 * 2) + 10
값2: 10 * (2 + 10)
`

    const result = yaksok(code).getRunner().scope

    assertEquals(result.getVariable('값1'), new NumberValue(30))
    assertEquals(result.getVariable('값2'), new NumberValue(120))
})
