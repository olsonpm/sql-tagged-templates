# More Usage Info

<br>

## Table Of Contents

<!-- toc -->

- [How it works](#how-it-works)
- [Building complex queries with nesting](#building-complex-queries-with-nesting)
- [Raw values](#raw-values)
  - [Conditionally Add SQL](#conditionally-add-sql)
- [Array Values](#array-values)
- [Bound Statements in sequelize](#bound-statements-in-sequelize)
- [Handle Dynamic Sets Of Data](#handle-dynamic-sets-of-data)
  - [Use Case](#use-case)
  - [How combineParts can help](#how-combineparts-can-help)
  - [Why makeCombineParts?](#why-makecombineparts)

<!-- tocstop -->

<br>

## How it works

sql-tagged-templates returns an _object_ that is understood by each
database library.

You can view [quick examples of each dialect here][dialect-examples].

<br>

## Building complex queries with nesting

You can compose queries via nesting e.g.

```js
const where = stt`where title = ${params.title}`
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
const mdTable = stt.raw(mariadbConnection.escapeId(someUserInput))
const mdQuery = stt.mysql2`select * from ${mdTable}`

const msTable = stt.raw(mysql2.escapeId(someUserInput))
const msQuery = stt.mysql2`select * from ${msTable}`

const pgTable = stt.raw(pg.escapeIdentifier(someUserInput))
const pgQuery = stt.pg`select * from ${pgTable}
```

> [!warning]
> Please note that when inserting raw values, you are responsible for quoting
> and escaping these values with proper escaping functions first if they come
> from user input (E.g. `mariadbConnection.escapeId()`, `mysql2.escapeId()`
> and `pg.escapeIdentifier()`).

<br>

### Conditionally Add SQL

You can use `.empty` to conditionally build SQL.

```js
const conditionalWhere = params.title
  ? stt`where title = ${params.title}`
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
const query = stt`select title from books where author = any(${authors})`
// query.text is 'select title from books where author = any($1)'
// query.values is [['Kurt Vonnegut', 'Charles Bukowski']]
```

<br>

## Bound Statements in sequelize

By default, Sequelize will escape replacements on the client. To switch to using
a bound statement in Sequelize, use `stt.bound`.

```js
// old way
sequelize.query('select title from books where author = ?', {
  bind: [author],
})

// with sql-tagged-templates
import stt from 'sql-tagged-templates/sequelize'
const query = stt.bound(`select title from books where author = ${author}`)
sequelize.query(query)

// you can optionally use the named export instead.  They are identical
import { bound as stt } from 'sql-tagged-templates/sequelize'
```

<br>

## Handle Dynamic Sets Of Data

This section explains how `combineParts` helps us build queries for dynamic sets
of data.

It's a complex topic so let's start with a use case.

<br>

### Use Case

Let's say we have a library search page where you can filter by author and date
published.  If the user doesn't declare any filters, then our query
is simple

```sql
select *
from books
```

If the user searches for author 'Vonnegut', then we'd add

```sql
where author like '%Vonnegut%'
```

And if they additionally search by publish date later than 1970, we'd add

```sql
  and publish_date >= '1970-01-01'
```

Notice the three cases our search has to handle
  - no filters
  - one filter e.g. `where <filter1>`
  - multiple filters e.g. `where <filter1> and <filter2>`

Managing this by hand becomes monotonous, so let's see how `combineParts` helps.

<br>

### How combineParts can help

Let's build our filter logic above using `combineParts`

```js
import stt from 'sql-tagged-templates/pg'

function getBooks(userFilters = {}) {
  const { author, publishDate } = userFilters
  const filterParts = []
  if (author) {
    const wrappedAuthor = `%${author}%`
    filterParts.push(stt`author like ${wrappedAuthor}`)
  }
  if (publishDate) {
    filterParts.push(stt`publish_date > ${publishDate}`)
  }

  const options = { start: 'where ', separator: ' and ' }
  const where = stt.combineParts(options, filterParts)
  const query = stt`
    select *
    from books
    ${where}
  `
  // ...
}
```

How does this work?

When the user doesn't filter by anything, then filterParts is empty so
combineParts returns [`dialect.empty`](#conditionally-add-sql).

When the user filters by at least one thing, then combineParts starts the query
with 'where '.

And if the user passes multiple filters, then they'll be separated by ' and '.

Ultimately `combineParts` is a flexible function that helps with dynamic sets of
data.  It may be hard to wrap your head around - so feel free to ask via GitHub
issues whether it could solve your use case.

<br>

### Why makeCombineParts?

So we understand how combineParts helps, what's the point of `makeCombineParts`?

It's a functional programming (fp) friendly version - where us fp nerds find it
helpful to pass the data argument last.  If you're not familiar with fp then you
can forget this function and move on.

To show an example though: here's the above code using a functional approach
via [common-fp][common-fp]

```js
import { passThrough, pick, update } from 'common-fp'

function getBooks(userFilters = {}) {
  const buildFilterParts = {
    author: author => {
      const wrappedAuthor = `%${author}%`
      return stt`author like ${wrappedAuthor}`
    },
    publishDate: publishDate => stt`publish_date > ${publishDate}`),
  }

  const combineParts = makeCombineParts({ start: 'where ', separator: ' and ' })

  const where = passThrough(userFilters, [
    pick(['author', 'publishDate']),
    update(buildFilterParts),
    Object.values,
    combineParts,
  ])

  const query = stt`
    select *
    from books
    ${where}
  `
  // ...
}
```

I won't explain how the common-fp functions work, but one basic goal of this
solution is to avoid the if statements.  You can imagine how the if statements
grow with the number of filters - and fp feels that complicates the code.  You
may feel differently, that the functional approach is more complicated and hard
to follow.  Ain't nobody wrong, just differing styles trying to coexist :)

[common-fp]: https://common-fp.org
[dialect-examples]: ./dialect-examples.md
[pg-prepared-statement]: https://node-postgres.com/features/queries#prepared-statements
