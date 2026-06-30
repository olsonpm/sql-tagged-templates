import {
  assignDefaults,
  isDefined,
  mapValuesObj,
  passThrough,
  pick,
} from './fp-utils.mjs'
import { isRawSql, symbols as s } from './utils.mjs'

const optionKeys = ['start', 'separator', 'end']

const buildCombineParts = dialect => (options, parts) => {
  validateInput(options, parts)
  if (!parts.length) return dialect.empty

  const { start, end, separator } = sanitizeOptions(options)
  const separatorArr = new Array(parts.length - 1).fill().map(() => separator)

  const strings = [start, ...separatorArr, end]

  return dialect(strings, ...parts)
}

function sanitizeOptions(options) {
  return passThrough(options, [
    pick(optionKeys),
    assignDefaults({ start: '', separator: ', ', end: '' }),
    mapValuesObj(stringFromRawSql),
  ])
}

function stringFromRawSql(strOrRawSql) {
  return isRawSql(strOrRawSql) ? strOrRawSql[s.rawSql] : strOrRawSql
}

function validateInput(options, parts) {
  if (!options) throw new Error('combineClause requires options to be passed')
  if (!Array.isArray(parts)) {
    throw new Error('combineClause requires parts to be an array')
  }
  if (!isDefined(options.separator))
    throw new Error('combineClause requires options.separator to be defined')
  const invalidOptions = optionKeys.filter(k => !isValidSql(options[k]))

  if (invalidOptions.length) {
    let msg = 'combineClause requires options to either be strings or rawSql '
    msg += 'instances.  The following options passed are invalid.'
    msg += invalidOptions.map(o => `\n - ${o}`).join('')
    throw new Error(msg)
  }
  if (!options.separator)
    throw new Error(
      'combineClause requires options.separator to be a truthy string'
    )
}

function isValidSql(option) {
  return option === undefined || typeof option === 'string' || isRawSql(option)
}

export default buildCombineParts
