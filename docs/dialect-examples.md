## Dialect Examples

All examples assume a const author

```js
const author = 'Kurt Vonnegut'
```

<br>

### mariadb

```js
mariadb.query('select title from books where author = ?', [author])

// is equivalent to
import stt from 'sql-tagged-templates/mariadb'
mariadb.query(stt`select title from books where author = ${author}`)
```

<br>

### mysql2

```js
mysql2.query('select title from books where author = ?', [author])

// is equivalent to
import stt from 'sql-tagged-templates/mysql2'
mysql2.query(stt`select title from books where author = ${author}`)
```

<br>

### pg

```js
pg.query('select title from books where author = $1', [author])

// is equivalent to
import stt from 'sql-tagged-templates/pg'
pg.query(stt`select title from books where author = ${author}`)
```

<br>

### sequelize

```js
sequelize.query('select title from books where author = ?', {
  replacements: [author],
})

// is equivalent to
import stt from 'sql-tagged-templates/sequelize'
sequelize.query(stt`select title from books where author = ${author}`)
```
