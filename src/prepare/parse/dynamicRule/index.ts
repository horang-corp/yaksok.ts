import { Yaksok } from '@'
import { Node } from '@/node'
import { getDynamicRulesFromMention } from './mention/getRulesFromMention'
import { createLocalDynamicRules } from './local/index'
import { TokenizeResult } from '../../tokenize/index'

export function createDynamicRule(tokenized: TokenizeResult, runtime?: Yaksok) {
    const localRules = createLocalDynamicRules(tokenized)
    const mentioningRules = runtime
        ? getDynamicRulesFromMention(tokenized.tokens, runtime)
        : []

    return [...localRules, ...mentioningRules]
}
