import flattenStringsAndValues from './flatten-strings-and-values.mjs'
import { symbols as s } from './utils.mjs'

const buildQueryByPlaceholderType = {
  numbered: strings => strings.reduce((res, cur, i) => res + '$' + i + cur),
  ordered: strings => strings.join('?'),
}

const makeDialect = options => {
  const { placeholderType, stringName, valuesName = 'values' } = options

  const buildQuery = buildQueryByPlaceholderType[placeholderType]

  const dialect = (strings, ...values) => {
    const flat = flattenStringsAndValues({ strings, values })
    return {
      [stringName]: buildQuery(flat.strings),
      [valuesName]: flat.values,
      [s.isQuery]: true,
      [s.strings]: flat.strings,
      [s.strings]: flat.values,
    }
  }

  dialect.raw = rawString => {
    if (Array.isArray(rawString)) {
      let msg = 'raw is a function, not a tagged template'
      msg +=
        "\n  e.g. you call it with parentheses like `stt.raw('some_column')`"
      msg += "\n  *not* like `stt.raw`'some_column'`"
      throw new Error(msg)
    }
    return {
      rawString,
      [s.isRawString]: true,
    }
  }

  dialect.empty = dialect.raw('')

  return dialect
}

export default makeDialect
