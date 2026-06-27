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

sql-tagged-templates exports three dialects which you import via named or using
a subpath.

<br>

### Named Imports

```js
import * as stt from 'sql-tagged-templates'

// examples
const msQuery = stt.mysql2`select * from books`
const pgQuery = stt.pg`select * from books`
const sqQuery = stt.sequelize`select * from books`
```

<br>

### Subpath Imports

```js
import stt from 'sql-tagged-templates/mysql2'
import stt from 'sql-tagged-templates/pg'
import stt from 'sql-tagged-templates/sequelize'
```

<br>

## Dialect

A 'dialect' is a tagged template function producing a query compatible with its
library.

The dialects have these types.

```ts
type Mysql2Dialect = Dialect<Mysql2Query>
type PgDialect = Dialect<PgQuery>

// the bound dialect is explained in the next section
type SequelizeDialect = Dialect<SequelizeQuery> & {
  bound: SequelizeBoundDialect
}
type SequelizeBoundDialect = Dialect<SequelizeBoundQuery>


// helper types

type HasValues = { values: unknown[] }

type Mysql2Query = HasValues & { sql: string }
type PgQuery = HasValues & { text: string }
type SequelizeQuery = HasValues & { query: string }
type SequelizeBoundQuery = { bind: unknown[], query: string }

type DialectQuery = Mysql2Query | PgQuery | SequelizeQuery | SequelizeBoundQuery

type Dialect<DQ extends DialectQuery> = {
  (strings: string[], ...values: unknown[]): DQ,

  // raw and empty are explained in a later section
  raw: <S extends string>(rawString: S) => ({ rawString: S }),
  empty: { rawString: '' }
}
```

> [!note]
> These types are the public API and leave out enumerable symbol-keyed
> properties used for building the query.  Those properties are our internal API
> and may change on non-major version bumps.

<br>

## Sequelize - Bind

The sequelize dialect has an additional export `bound` which uses [the bind parameter][sequelize-bind-param]
for the values.

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

Each dialect exposes a `.raw(rawString: string)` function enabling you to
include dynamic raw sql for things like dynamic column names.
See [usage and examples here][raw-usage].

## Dialect.empty

Each dialect exposes an `.empty` property allowing you to include conditional
sql.  See [usage and examples here][empty-usage]

[empty-usage]: ./more-usage-info.md#conditionally-add-sql
[raw-usage]: ./more-usage-info.md#raw-values
[sequelize-bind-param]: https://sequelize.org/docs/v6/core-concepts/raw-queries/#bind-parameter
[sequelize-replacements]: https://sequelize.org/docs/v6/core-concepts/raw-queries/#replacements
