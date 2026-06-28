## Dialect Example Objects

```js
const author = 'Kurt Vonnegut'

const pgQuery = stt.pq`select title from books author = ${author}`
// pqQuery.text is 'select title from books author = $1'
// pgQuery.values is ['Kurt Vonnegut']

const mdQuery = stt.mariadb`select title from books author = ${author}`
// msQuery.sql is 'select title from books author = ?'
// msQuery.values is ['Kurt Vonnegut']

const msQuery = stt.mysql2`select title from books author = ${author}`
// msQuery.sql is 'select title from books author = ?'
// msQuery.values is ['Kurt Vonnegut']

const sqQuery = stt.sequelize`select title from books author = ${author}`
// sqQuery.query is 'select title from books author = ?'
// sqQuery.values is ['Kurt Vonnegut']

const sqBoundQuery = stt.sequelize.bound`select title from books author = ${author}`
// sqBoundQuery.query is 'select title from books author = ?'
// sqBoundQuery.bind is ['Kurt Vonnegut']
```
