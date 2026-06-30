# SQL Tagged Templates

<br>

## Table Of Contents

<!-- toc -->

- [What is it?](#what-is-it)
- [Why make this library?](#why-make-this-library)
- [What database libraries are supported?](#what-database-libraries-are-supported)
- [Why is this library helpful?](#why-is-this-library-helpful)
- [What all changed from sql-template-strings?](#what-all-changed-from-sql-template-strings)
- [More Usage Info](#more-usage-info)
- [API Reference](#api-reference)

<!-- tocstop -->

<br>

## What is it?

A library to simplify writing dynamic SQL.

For example, you can write a parameterized query to MariaDB like this:

```js
import stt from 'sql-tagged-templates/mariadb`

const author = 'Kurt Vonnegut'
const query = stt`select * from books where author = ${author}`
// query.sql is 'select * from books author = ?'
// query.values is ['Kurt Vonnegut']

const rows = await mariadbPool.query(query)
```

<br>

## Why make this library?

This is a fork/rewrite of Felix Becker's [node-sql-template-strings][sts]

I forked it because I wanted a few features for cleaner and more
reusable queries

- immutability
- nested queries

Please note this isn't a drop-in replacement. If you're porting from
sql-template-strings then [view our migration guide][migration-guide].

<br>

## What database libraries are supported?

- [mariadb][mariadb]@3.x
- [mysql2][mysql2]@3.x
- [postgres][postgres]@8.x
- [sequelize][sequelize]@6.x

Quick examples for each can be [viewed here][dialect-examples].

<br>

## Why is this library helpful?

It makes your larger dynamic queries more readable.

For example, inserting many values:

```js
db.query(`
  insert into books (title, author, isbn, category, recommended_age, pages, price)
  values (?, ?, ?, ?, ?, ?, ?)`,
  [title, author, isbn, category, recommendedAge, pages, price]
)

// is more readable as
db.query(stt`
  insert into books (title, author, isbn, category, recommended_age, pages, price)
  values (${title}, ${author}, ${isbn}, ${category}, ${recommendedAge}, ${pages}, ${price})
`)
```

As your queries grow more complex, sql-tagged-templates allows you to easily
reuse portions and compose them into full queries [via nesting][nested-queries].
Acheiving the same with sql-template-strings becomes unweildy using `.append()`.

<br>

## What all changed from sql-template-strings?

- This is a [pure ESM package][pure-esm]
- Only supports LTS versions of node
- Drop support for the older [mysql][mysql] package
- Add support for the [mariadb][mariadb] package
- Only support the latest major versions of the other libraries [listed above][db-libs-supported].
  - The older versions may work fine, I just don't want to write tests for them
    nor support compatibility
- [Dialects are now explicit][explicit-dialects]
- The exported dialects are pure and immutable.
  - This means a lot of the API has been removed e.g. no append, useBind,
    setName and no exported class SQLStatement.
  - Migrating from that API?  See our [migration guide][migration-guide]
- [Queries can be nested][nested-queries]
- [Raw SQL is now explicit][raw-usage]
- Add a helper `combineParts`
  - This function helps with dynamic sets of data e.g. user selected filters for
    a query.  See more about [how combineParts helps here][why-combine-parts]
  - There's also a functional programming friendly version [`makeCombineParts`][why-make-combine-parts]

<br>

## More Usage Info

Additional usage documentation [can be found here][more-usage-info]


## API Reference

View [the API reference here][api-reference]

[api-reference]: ./docs/api-reference.md
[db-libs-supported]: #what-database-libraries-are-supported
[dialect-examples]: ./docs/dialect-examples.md
[explicit-dialects]: ./docs/api-reference.md#exports
[mariadb]: https://www.npmjs.com/package/mariadb
[migration-guide]: ./docs/migrating-from-sts.md
[more-usage-info]: ./docs/more-usage-info.md
[mysql]: https://www.npmjs.com/package/mysql
[mysql2]: https://www.npmjs.com/package/mysql2
[nested-queries]: ./docs/more-usage-info.md#building-complex-queries-with-nesting
[postgres]: https://www.npmjs.com/package/pg
[pure-esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c
[raw-usage]: ./docs/more-usage-info.md#raw-values
[sequelize]: https://www.npmjs.com/package/sequelize
[sts]: https://github.com/felixfbecker/node-sql-template-strings
[why-combine-parts]: ./docs/more-usage-info.md#handle-dynamic-arrays
[why-make-combine-parts]: ./docs/more-usage-info.md#why-makecombineparts
