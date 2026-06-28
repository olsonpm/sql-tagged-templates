type Dialect<Query> = {
  (strings: TemplateStringsArray, ...values: unknown[]): Query

  // raw and empty are explained in a later section
  raw: (rawSql: string) => unknown
  empty: unknown
}

export type { Dialect }
