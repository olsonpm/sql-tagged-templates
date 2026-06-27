# More Usage Info

## Table Of Contents

<!-- toc -->

- [How it works](#how-it-works)
- [Building complex queries with nesting](#building-complex-queries-with-nesting)
- [Raw values](#raw-values)
  - [Conditionally Add Sql](#conditionally-add-sql)
    - [Note](#note)
- [Array Values](#array-values)
- [Named Prepared Statements in Postgres](#named-prepared-statements-in-postgres)
- [Bound Statements in sequelize](#bound-statements-in-sequelize)

<!-- tocstop -->

<br>

## How it works

sql-tagged-templates returns an _object_ that is understood by each
database library.

You can view [quick examples of each dialect here][dialect-example-objects].

<br>

## Building complex queries with nesting

You can compose queries via nesting e.g.

```js
const where = stt`where name = ${params.name}`
const limit = stt`limit 10 offset ${params.offset || 0}`

const query = stt`
  select *
  from books
  ${where}
  ${limit}
`
```

<br>

## Raw values

Use `stt.raw('your string')` to pass raw sql.

For example, you can use `.raw()` to select from a dynamic table.

```js
const table = stt.raw('books')
const query = stt`select * from ${table}`

// escape user input manually
const msTable = mysql2.escapeId(someUserInput)
const msQuery = stt.mysql2`select * from ${msTable}`

const pgTable = pg.escapeIdentifier(someUserInput)
const pgQuery = stt.pg`select * from ${pgTable}
```

> [!warning]
> Please note that when inserting raw values, you are responsible for quoting
> and escaping these values with proper escaping functions first if they come
> from user input (E.g. `mysql2.escapeId()` and `pg.escapeIdentifier()`).

> [!warning]
> Also, executing many prepared statements with changing raw values in a loop
> will quickly overflow the prepared statement buffer (and destroy their
> performance benefit), so be careful.

<br>

### Conditionally Add Sql

You can use `.empty` to conditionally build sql.

```js
const conditionalWhere = params.name
  ? stt`where name = ${params.name}`
  : stt.empty

const query = stt`
  select *
  from books
  ${conditionalWhere}
`
```

<br>

#### Note

`stt.empty` is just `stt.raw('')`. Also, when nested, it's functionally
equivalent to an empty statement e.g. ` stt`` `.

For example, these three queries are the same.

```js
import stt from 'sql-tagged-templates/pg'

let empty = stt.empty
let query = stt`select * from books ${empty}`

empty = stt.raw('')
query = stt`select * from books ${empty}`

empty = stt``
query = stt`select * from books ${empty}`

// all three queries have
// query.text => 'select * from books '
// query.values => []
```

<br>

## Array Values

PostgreSQL allows you to pass an array value via `any`, e.g.

```js
const authors = ['Kurt Vonnegut', 'Charles Bukowski']
const query = stt`select name from books where author = any(${authors})`
query.text // => 'select name from books where author = any($1)'
query.values // => [['Kurt Vonnegut', 'Charles Bukowski']]
```

<br>

## Named Prepared Statements in Postgres

Postgres has the option of naming prepared statements, which allows parsing and
other work to be reused (and requires the SQL associated with the name to stay
the same, with only the parameters changing).

You can set the name by assigning the name property to your query.

```js
// old way
pg.query({
  name: 'my_query',
  text: 'select author from books where name = $1',
  values: [book],
})

// with sql-tagged-templates
const query = stt`select author from books where name = ${book}`
query.name = 'my_query'
pg.query(query)
```

<br>

## Bound Statements in sequelize

By default, Sequelize will escape replacements on the client. To switch to using
a bound statement in Sequelize, use `stt.bound`.

```js
// old way
sequelize.query('select name from books where author = ?', {
  bind: [author],
})

// with sql-tagged-templates
import stt from 'sql-tagged-templates/sequelize'
const query = stt.bound(`select name from books where author = ${author}`)
sequelize.query(query)

// you can optionally use the named export instead.  They are identical
import { bound as stt } from 'sql-tagged-templates/sequelize'
```

[dialect-example-objects]: ./dialect-example-objects.md
