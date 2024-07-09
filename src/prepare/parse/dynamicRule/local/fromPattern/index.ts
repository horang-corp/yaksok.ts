import { Node } from '@/node'

import { satisfiesPattern } from '../../../satisfiesPattern'
import { dynamicPatternDetector, dynamicRuleFactory } from './pattern'

export function* getDynamicRulesFromPattern(tokens: Node[]) {
    let end = 0

    while (true) {
        for (const rule of dynamicPatternDetector) {
            if (end < rule.pattern.length) continue

            const substack = tokens.slice(end - rule.pattern.length, end)
            if (!satisfiesPattern(substack, rule.pattern)) continue

            const dynamicRule = dynamicRuleFactory[rule.name](substack)
            yield dynamicRule
        }

        end++
        if (end > tokens.length) break
    }
}
