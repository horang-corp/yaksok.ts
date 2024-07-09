import { assertEquals } from 'assert'

import { Block } from '../src/node/block'
import { Formula } from '../src/node/calculation'
import { IfStatement, SetVariable } from '../src/node/index'
import { EOL } from '../src/node/misc'
import { EqualOperator } from '../src/node/operator'
import { NumberValue } from '../src/node/primitive'
import { parse } from '../src/prepare/parse/index'
import { tokenize } from '../src/prepare/tokenize/index'

Deno.test('Parse with indent', () => {
    const code = `
만약 1 = 1 이면
    만약 2 = 2 이면
        값: 5
    아니면
        값: 6
아니면
    값: 3
`

    const { ast } = parse(tokenize(code, true))

    assertEquals(
        ast,
        new Block([
            new EOL(),
            new IfStatement([
                {
                    condition: new Formula([
                        new NumberValue(1),
                        new EqualOperator(),
                        new NumberValue(1),
                    ]),
                    body: new Block([
                        new IfStatement([
                            {
                                condition: new Formula([
                                    new NumberValue(2),
                                    new EqualOperator(),
                                    new NumberValue(2),
                                ]),
                                body: new Block([
                                    new SetVariable('값', new NumberValue(5)),
                                ]),
                            },
                            {
                                body: new Block([
                                    new SetVariable('값', new NumberValue(6)),
                                ]),
                            },
                        ]),
                        new EOL(),
                    ]),
                },
                {
                    body: new Block([
                        new SetVariable('값', new NumberValue(3)),
                    ]),
                },
            ]),
            new EOL(),
        ]),
    )
})
