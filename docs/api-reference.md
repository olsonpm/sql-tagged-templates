# API Reference

## Table Of Contents

<!-- toc -->

- [Exports](#exports)
  - [Named Imports](#named-imports)
  - [Subpath Imports](#subpath-imports)
- [Dialect](#dialect)
- [Sequelize - Bind](#sequelize---bind)
- [Dialect.raw()](#dialectraw)
- [Dialect.empty](#dialectempty)

<!-- tocstop -->

<br>

## Exports

sql-tagged-templates exports four [dialects](#dialect) which you import via name or subpath.

*Note*: sequelize has an additional 'bound' dialect [explained further down](#sequelize---bind)

<br>

### Named Imports

```js
import * as stt from 'sql-tagged-templates'

// examples
const mdQuery = stt.mariadb`select * from books`
const msQuery = stt.mysql2`select * from books`
const pgQuery = stt.pg`select * from books`
const sqQuery = stt.sequelize`select * from books`
const sqQuery = stt.sequelize.bound`select * from books`
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

A 'dialect' is a tagged template function producing a query object compatible
with its library.

You can [view quick examples of each dialect here][dialect-examples].

The dialects have these types.

<details>

<summary>Click to show types</summary>

<br>

> [!note]
> These types define the public API and leave out properties and structures used
> internally for building the query.  Internal properties may change on
> non-major version bumps.

```ts
type MariadbDialect = Dialect<MariadbQuery>
type Mysql2Dialect = Dialect<Mysql2Query>
type PgDialect = Dialect<PgQuery>
type SequelizeDialect = Dialect<SequelizeQuery> & {
  bound: SequelizeBoundDialect
}
type SequelizeBoundDialect = Dialect<SequelizeBoundQuery>


// helper types

type HasValues = { values: unknown[] }

type MariadbQuery = HasValues & { sql: string }
type Mysql2Query = HasValues & { sql: string }
type PgQuery = HasValues & { text: string }
type SequelizeQuery = HasValues & { query: string }
type SequelizeBoundQuery = { bind: unknown[], query: string }

type DialectQuery = MariadbQuery
  | Mysql2Query
  | PgQuery
  | SequelizeQuery
  | SequelizeBoundQuery

type Dialect<DQ extends DialectQuery> = {
  (strings: TemplateStringsArray, ...values: unknown[]): DQ,

  // raw and empty are explained in a later section
  raw: (rawSql: string) => unknown,
  empty: unknown
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

## Dialect.raw()

Each dialect exposes a `.raw(rawSql: string)` function for things like adding
dynamic column names. See [usage and examples here][raw-usage].

## Dialect.empty

Each dialect exposes an `.empty` property allowing you to include conditional
sql.  See [usage and examples here][empty-usage]

[dialect-examples]: ./dialect-examples.md
[empty-usage]: ./more-usage-info.md#conditionally-add-sql
[raw-usage]: ./more-usage-info.md#raw-values
[sequelize-bind-param]: https://sequelize.org/docs/v6/core-concepts/raw-queries/#bind-parameter
[sequelize-replacements]: https://sequelize.org/docs/v6/core-concepts/raw-queries/#replacements
