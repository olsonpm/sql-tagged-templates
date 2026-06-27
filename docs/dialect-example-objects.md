## Dialect Example Objects

```js
const book = 'Player Piano'
const author = 'Kurt Vonnegut'

const pgQuery = stt.pq`select author from books where name = ${book} and author = ${author}`
pqQuery.text // => 'select author from books where name = $1 and author = $2'
pgQuery.values // => ['Player Piano', 'Kurt Vonnegut']

const msQuery = stt.mysql2`select author from books where name = ${book} and author = ${author}`
msQuery.sql // => 'select author from books where name = ? and author = ?'
msQuery.values // => ['Player Piano', 'Kurt Vonnegut']

const sqQuery = stt.sequelize`select author from books where name = ${book} and author = ${author}`
sqQuery.query // => 'select author from books where name = ? and author = ?'
sqQuery.values // => ['Player Piano', 'Kurt Vonnegut']
```
