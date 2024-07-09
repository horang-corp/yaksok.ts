import { assertEquals } from 'assert'

import {
    Block,
    EOL,
    Formula,
    PlusOperator,
    SetVariable,
} from '../src/node/index'
import { StringValue } from '../src/node/primitive'
import { parse } from '../src/prepare/parse/index'
import { tokenize } from '../src/prepare/tokenize/index'

Deno.test('Matching case: Wrapping class inherits from child class', () => {
    const code = `
이름: "홍길" + "동"    
`

    const { ast } = parse(tokenize(code, true))

    assertEquals(
        ast,
        new Block([
            new EOL(),
            new SetVariable(
                '이름',
                new Formula([
                    new StringValue('홍길'),
                    new PlusOperator(),
                    new StringValue('동'),
                ]),
            ),
            new EOL(),
        ]),
    )
})
