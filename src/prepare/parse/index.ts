import { Yaksok } from '@'
import { Node } from '@/node'

import { createDynamicRule } from './dynamicRule/index'
import { callParseRecursively } from './srParse'
import { parseIndent } from './parseIndent'
import { TokenizeResult } from '../tokenize/index'

export function parse(tokenized: TokenizeResult, runtime?: Yaksok) {
    const dynamicRules = createDynamicRule(tokenized, runtime)
    const indentedNodes = parseIndent(tokenized.tokens)

    const ast = callParseRecursively(indentedNodes, dynamicRules)

    return { ast, dynamicRules }
}
