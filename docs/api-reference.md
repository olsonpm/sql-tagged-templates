# API Reference

<br>

## Table Of Contents

<!-- toc -->

- [Exports](#exports)
  - [Named Imports](#named-imports)
  - [Subpath Imports](#subpath-imports)
- [Dialect](#dialect)
- [Sequelize - Bind](#sequelize---bind)
- [Dialect.raw()](#dialectraw)
- [Dialect.empty](#dialectempty)
- [Dialect.combineParts()](#dialectcombineparts)
- [Dialect.makeCombineParts()](#dialectmakecombineparts)

<!-- tocstop -->

<br>

## Exports

sql-tagged-templates exports four [dialects](#dialect) which you import via name
or subpath.

**Note:** sequelize has an additional 'bound' dialect [explained further down](#sequelize---bind)

<br>

### Named Imports

```js
import * as stt from 'sql-tagged-templates'

// examples
const mdQuery = stt.mariadb`select * from books`
const msQuery = stt.mysql2`select * from books`
const pgQuery = stt.pg`select * from books`
const sqQuery = stt.sequelize`select * from books`
const sqbQuery = stt.sequelize.bound`select * from books`
```

<br>

### Subpath Imports

```js
import stt from 'sql-tagged-templates/mariadb'
import stt from 'sql-tagged-templates/mysql2'
import stt from 'sql-tagged-templates/pg'
import stt, { bound } from 'sql-tagged-templates/sequelize'
```

<br>

## Dialect

A 'dialect' is a tagged template function returning a query object compatible
with its library.

You can [view quick examples of each dialect here][dialect-examples].

<details>

<summary>Click to show typescript definitions</summary>

<br>

**Note:** These types define the public API and leave out properties used
internally for building the query.  Internal properties may change on non-major
version bumps.

```ts
type MariadbDialect = Dialect<{ sql: string, values: unknown[] }>
type Mysql2Dialect = Dialect<{ sql: string, values: unknown[] }>
type PgDialect = Dialect<{ text: string, values: unknown[] }>
type SequelizeDialect = Dialect<{ query: string, values: unknown[] }> & {
  bound: SequelizeBoundDialect
}
type SequelizeBoundDialect = Dialect<{ query: string, bind: unknown[] }>


// Dialect definition

declare const rawSqlKey: unique symbol
type RawSql = { [rawSqlKey]: string }

type CombinePartsOptions = {
  start?: string | RawSql
  separator: string | RawSql
  end?: string | RawSql
}

type Dialect<Query> = {
  (strings: TemplateStringsArray, ...values: unknown[]): Query,

  raw: (rawSql: string) => RawSql
  empty: { [rawSqlKey]: '' }

  combineParts: (options: CombinePartsOptions, parts: unknown[]) => Query
  makeCombineParts: (
    options: CombinePartsOptions
  ) => (parts: unknown[]) => Query
}
```

</details>

<br>

## Sequelize - Bind

The sequelize dialect has an additional export `bound` which uses [the bind parameter][sequelize-bind-param].

By default we use [replacements][sequelize-replacements].  This is a carryover
from sql-template-strings.

To use the bound export, you can either use the 'bound' property or import it
by name. e.g.

```js
import stt, { bound as boundStt } from 'sql-tagged-templates/sequelize'

stt.bound`select * from books`
boundStt`select * from books`

// where stt.bound === boundStt
```

<br>

## Dialect.raw()

Each dialect exposes a `.raw(rawSql: string)` function for things like adding
dynamic column names. See [usage and examples here][raw-usage].

<br>

## Dialect.empty

Each dialect exposes an `.empty` property allowing you to include conditional
SQL.  See [usage and examples here][empty-usage]

<br>

## Dialect.combineParts()

This function returns a query which accounts for a dynamic array of values.  The
simplest case is if you want to update a dynamic number of columns.

See [usage and examples here][combine-parts-usage].

<details>

<summary>Click to show typescript definitions</summary>

```ts
// Query is from the dialect.  For context, view the Dialect type definitions
type combineParts = (options: CombinePartsOptions, parts: unknown[]) => Query

type CombinePartsOptions = {
  start?: string | RawSql
  separator: string | RawSql
  end?: string | RawSql
}
```

</details>

<br>

## Dialect.makeCombineParts()

This is a functional programming friendly version of `combineParts`.  Its type
is simple:

```ts
type makeCombineParts = (options: CombinePartsOptions) => (parts: unknown[]) => Query
```

See [usage and examples here][make-combine-parts-usage].

Note: If you're not familiar with functional programming then you probably won't
need this method.


[dialect-examples]: ./dialect-examples.md
[empty-usage]: ./more-usage-info.md#conditionally-add-sql
[combine-parts-usage]: ./more-usage-info.md#handle-dynamic-arrays
[make-combine-parts-usage]: ./more-usage-info.md#why-makecombineparts
[raw-usage]: ./more-usage-info.md#raw-values
[sequelize-bind-param]: https://sequelize.org/docs/v6/core-concepts/raw-queries/#bind-parameter
[sequelize-replacements]: https://sequelize.org/docs/v6/core-concepts/raw-queries/#replacements
