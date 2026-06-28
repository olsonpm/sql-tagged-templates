import { symbols as s } from '#src/utils'

const makeRawSql = rawSql => ({
  rawSql,
  [s.isRawSql]: true,
})

/**
 * note: 'shallow' refers to it not being nested.  i.e. no sub-queries nor raw
 *   sql will be in values which allows us to skip any processing
 */
const makeShallowQuery = (strings, ...values) => ({
  text: strings.reduce((res, cur, i) => res + '$' + i + cur),
  values,
  [s.isQuery]: true,
  [s.strings]: strings,
  [s.values]: values,
})

export { makeRawSql, makeShallowQuery }
