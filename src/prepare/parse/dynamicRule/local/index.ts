import { TokenizeResult } from '../../../tokenize/index'
import { getDynamicRulesFromPattern } from './fromPattern/index'
import { createFunctionRules } from './function/index'

export function createLocalDynamicRules({
    tokens,
    functionHeaders,
    ffiHeaders,
}: TokenizeResult) {
    const functionRules = functionHeaders.flatMap((rule) =>
        createFunctionRules(rule, 'yaksok'),
    )
    const ffiRules = ffiHeaders.flatMap((header) =>
        createFunctionRules(header, 'ffi'),
    )
    const rulesFromPattern = getDynamicRulesFromPattern(tokens)

    return [...rulesFromPattern, ...functionRules, ...ffiRules]
}
