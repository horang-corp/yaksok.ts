import { Yaksok } from '@'
import { Block, Mention, MentionScope, Node } from '@/node'

import { createDynamicRule } from './dynamicRule/index'
import { callParseRecursively } from './srParse'
import { parseIndent } from './parseIndent'
import { TokenizeResult } from '../tokenize/index'
import { PatternUnit, Rule } from './rule'

export function parse(tokenized: TokenizeResult, runtime?: Yaksok): {
    ast: Block;
    dynamicRules: Array<(Rule | {
        pattern: Array<(PatternUnit | {
            type: typeof Mention;
            value: string;
        })>;
        config: {
            __internal: {
                originRule: Rule;
                fileName: string;
            };
        };
        factory: (nodes: Node[]) => MentionScope;
    })>;
} {
    const dynamicRules = createDynamicRule(tokenized, runtime)
    const indentedNodes = parseIndent(tokenized.tokens)

    const ast = callParseRecursively(indentedNodes, dynamicRules)

    return { ast, dynamicRules }
}
