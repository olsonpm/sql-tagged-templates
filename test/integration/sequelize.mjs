import assert from 'node:assert'
import Sequelize from 'sequelize'
import sts from '../../src/index.mjs'

describe('sequelize', function() {
  this.timeout(10000)
  it('should work with a simple query', () => {
    const sequelize = new Sequelize(process.env.PG_CONN, { logging: false })
    return sequelize.query(sts`SELECT ${1} + 1 as result`, { type: Sequelize.QueryTypes.SELECT }).then(rows => {
      assert.equal(rows[0].result, 2)
    })
  })
  it('should work with a bound statement', () => {
    const sequelize = new Sequelize(process.env.PG_CONN, { logging: false })
    return sequelize
      .query(sts`SELECT ${1} + 1 as result`.useBind(true), { type: Sequelize.QueryTypes.SELECT })
      .then(rows => {
        assert.equal(rows[0].result, 2)
      })
  })
})
