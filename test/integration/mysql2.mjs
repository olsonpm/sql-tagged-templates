import assert from 'node:assert'
import mysql2 from 'mysql2'
import mysql2Promise from 'mysql2/promise'
import sts from '../../src/index.mjs'

describe('mysql2', function() {
  this.timeout(10000)
  for (const test of ['Connection', 'Pool']) {
    describe(test, () => {
      for (const method of ['query', 'execute']) {
        describe(method, () => {
          it('should work with a simple query', done => {
            const connection = mysql2['create' + test](process.env.MYSQL_CONN)
            connection[method](sts`SELECT ${1} + 1 AS result`, (err, rows) => {
              if (err) {
                return done(err)
              }
              assert.equal(rows[0].result, 2)
              done()
            })
          })
        })
      }
    })
  }
})

describe('mysql2/promise', () => {
  for (const test of ['Connection', 'Pool']) {
    describe(test, () => {
      for (const method of ['query', 'execute']) {
        describe(method, () => {
          it('should work with a simple query', () => {
            return Promise.resolve(mysql2Promise['create' + test](process.env.MYSQL_CONN))
              .then(connection => {
                return connection[method](sts`SELECT ${1} + 1 AS result`)
              })
              .then(rowsAndFields => {
                assert.equal(rowsAndFields[0][0].result, 2)
              })
          })
        })
      }
    })
  }
})
