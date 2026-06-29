declare const rawSqlKey: unique symbol
type RawSql = { [rawSqlKey]: string }

type CombinePartsOptions = {
  before?: string | RawSql
  separator: string | RawSql
  after?: string | RawSql
}

type Dialect<Query> = {
  (strings: TemplateStringsArray, ...values: unknown[]): Query

  raw: (rawSql: string) => RawSql
  empty: { [rawSqlKey]: '' }

  combineParts: (options: CombinePartsOptions, parts: unknown[]) => Query
  makeCombineParts: (
    options: CombinePartsOptions
  ) => (parts: unknown[]) => Query
}

export type { CombinePartsOptions, Dialect, RawSql }
