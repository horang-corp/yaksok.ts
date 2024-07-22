import { Yaksok } from '@'
import { Mention, MentionScope, Node } from '@/node'
import { getDynamicRulesFromMention } from './mention/getRulesFromMention'
import { createLocalDynamicRules } from './local/index'
import { TokenizeResult } from '../../tokenize/index'
import { PatternUnit, Rule } from '../rule'

export function createDynamicRule(tokenized: TokenizeResult, runtime?: Yaksok): Array<(Rule | {
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
})> {
    const localRules = createLocalDynamicRules(tokenized)
    const mentioningRules = runtime
        ? getDynamicRulesFromMention(tokenized.tokens, runtime)
        : []

    return [...localRules, ...mentioningRules]
}
