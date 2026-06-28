# Dialect Examples

These examples show queries using each database library with and
without sql-tagged-templates.

They all assume a `const author = 'Kurt Vonnegut'`

## Table Of Contents

<!-- toc -->

  - [mariadb](#mariadb)
  - [mysql2](#mysql2)
  - [pg](#pg)
  - [sequelize](#sequelize)
  - [sequelize - bound](#sequelize---bound)

<!-- tocstop -->

<br>

### mariadb

```js
const rows = await mariadbPool.query(
  'select title from books where author = ?',
  [author]
)

// is equivalent to
import stt from 'sql-tagged-templates/mariadb'

const query = stt`select title from books where author = ${author}`
// query.sql is 'select title from books author = ?'
// query.values is ['Kurt Vonnegut']

const rows = await mariadbPool.query(query)
```

<br>

### mysql2

```js
const [rows] = await mysql2Pool.query(
  'select title from books where author = ?',
  [author]
)

// is equivalent to
import stt from 'sql-tagged-templates/mysql2'

const query = stt`select title from books where author = ${author}`
// query.sql is 'select title from books author = ?'
// query.values is ['Kurt Vonnegut']

const [rows] = await mysql2Pool.query(query)
```

<br>

### pg

```js
const { rows } = await pgPool.query(
  'select title from books where author = $1',
  [author]
)

// is equivalent to
import stt from 'sql-tagged-templates/pg'

const query = stt`select title from books where author = ${author}`
// query.text is 'select title from books author = $1'
// query.values is ['Kurt Vonnegut']

const { rows } = await pgPool.query(query)
```

<br>

### sequelize

*Note*: by default, sql-tagged-templates uses [replacements][sequelize-replacements].
Use [bound][sequelize-bind] if you want to use parameterized queries instead.

```js
const [rows] = await sequelize.query('select title from books where author = ?', {
  replacements: [author],
})

// is equivalent to
import stt from 'sql-tagged-templates/sequelize'

const query = stt`select title from books where author = ${author}`
// query.query is 'select title from books author = ?'
// query.values is ['Kurt Vonnegut']
// note: values are interpreted as "replacements" in sequelize

const [rows] = await sequelize.query(query)
```

<br>

### sequelize - bound

```js
const [rows] = await sequelize.query('select title from books where author = ?', {
  bind: [author],
})

// is equivalent to
import { bound as stt } from 'sql-tagged-templates/sequelize'

const query = stt`select title from books where author = ${author}`
// query.query is 'select title from books author = ?'
// query.bind is ['Kurt Vonnegut']

const [rows] = await sequelize.query(query)
```

[sequelize-bind]: https://sequelize.org/docs/v6/core-concepts/raw-queries/#bind-parameter
[sequelize-replacements]: https://sequelize.org/docs/v6/core-concepts/raw-queries/#replacements
