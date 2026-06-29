import { symbols as s } from '#src/utils'
import createMockFn from './create-mock-fn.mjs'
import spy from './spy.mjs'

const makeRawSql = rawSql => ({
  [s.rawSql]: rawSql,
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

export { createMockFn, makeRawSql, makeShallowQuery, spy }
