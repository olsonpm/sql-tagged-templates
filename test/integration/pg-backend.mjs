import path from 'node:path'
import { expect } from 'chai'
import { execa } from 'execa'
import { Pool } from 'pg'
import { Sequelize } from 'sequelize'
import * as stt from '#src/index'

const { dirname } = import.meta
const composePath = path.resolve(dirname, 'pg-docker-compose.yml')

describe('pg-backend', function () {
  this.timeout(15000)

  let pgPool
  let seq

  before(async () => {
    await execa`docker compose -f ${composePath} up -d --wait`
    pgPool = new Pool({
      user: 'test',
      password: 'test',
      host: 'localhost',
      port: '7887',
    })
    seq = new Sequelize('postgres://test:test@localhost:7887/test', {
      logging: false,
    })
  })

  after(async () => {
    await Promise.all([pgPool.end(), seq.close()])
    await execa`docker compose -f ${composePath} down`
  })

  it('pg should work with a simple query', async () => {
    const author = 'Kurt Vonnegut'
    const query = stt.pg`select * from books where author = ${author}`
    const res = await pgPool.query(query)
    expect(res.rows).to.deep.equal([
      { title: "Cat's Cradle", author },
      { title: 'Player Piano', author },
    ])
  })

  it('sequelize should work with a simple query', async () => {
    const author = 'Kurt Vonnegut'
    const query = stt.sequelize`select * from books where author = ${author}`
    const [rows] = await seq.query(query)
    expect(rows).to.deep.equal([
      { title: "Cat's Cradle", author },
      { title: 'Player Piano', author },
    ])
  })

  it('sequelize.bound should work with a simple query', async () => {
    const author = 'Kurt Vonnegut'
    const query = stt.sequelize
      .bound`select * from books where author = ${author}`
    const [rows] = await seq.query(query)
    expect(rows).to.deep.equal([
      { title: "Cat's Cradle", author },
      { title: 'Player Piano', author },
    ])
  })
})
