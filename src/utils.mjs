const isRawSql = val => typeof val?.[symbols.rawSql] === 'string'

const symbols = {
  isQuery: Symbol('sql-tagged-templates:is-query'),
  rawSql: Symbol('sql-tagged-templates:raw-sql'),
  strings: Symbol('sql-tagged-templates:strings'),
  values: Symbol('sql-tagged-templates:values'),
}

const toRawSql = str => ({ [symbols.rawSql]: str })

export { isRawSql, symbols, toRawSql }
