## Dialect Examples

<br>

### mysql2

```js
const book = 'harry potter'
const author = 'J. K. Rowling'

// mysql2
mysql2.query('SELECT author FROM books WHERE name = ? AND author = ?', [
  book,
  author,
])

// is equivalent to
import stt from 'sql-tagged-templates/mysql2'
mysql2.query(
  stt.mysql2`SELECT author FROM books WHERE name = ${book} AND author = ${author}`
)
```

<br>

### pg

```js
// postgres:
pg.query('SELECT author FROM books WHERE name = $1 AND author = $2', [
  book,
  author,
])

// is equivalent to
import stt from 'sql-tagged-templates/pg'
pg.query(
  stt`SELECT author FROM books WHERE name = ${book} AND author = ${author}`
)
```

<br>

### sequelize

```js
// sequelize:
sequelize.query('SELECT author FROM books WHERE name = ? AND author = ?', {
  replacements: [book, author],
})

// is equivalent to
import stt from 'sql-tagged-templates/sequelize'
sequelize.query(
  stt`SELECT author FROM books WHERE name = ${book} AND author = ${author}`
)
```
