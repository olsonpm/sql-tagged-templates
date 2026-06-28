import path from 'node:path'
import { expect } from 'chai'
import { execa } from 'execa'
import mariadb from 'mariadb'
import mysql2 from 'mysql2/promise'
import * as stt from '#src/index'

const { dirname } = import.meta
const composePath = path.resolve(dirname, 'mariadb-docker-compose.yml')

describe('mariadb-backend', function () {
  this.timeout(15000)

  const pool = {}

  before(async () => {
    await execa`docker compose -f ${composePath} up -d --wait`
    const connectionConfig = {
      user: 'test',
      password: 'test',
      host: 'localhost',
      port: '7886',
      database: 'test',
    }
    pool.mariadb = mariadb.createPool(connectionConfig)
    pool.mysql2 = mysql2.createPool(connectionConfig)
  })

  after(async () => {
    await Promise.all([pool.mariadb.end(), pool.mysql2.end()])
    await execa`docker compose -f ${composePath} down`
  })

  it('mariadb should work with a simple query', async () => {
    const author = 'Kurt Vonnegut'
    const query = stt.mariadb`select * from books where author = ${author}`
    const rows = await pool.mariadb.query(query)
    expect(rows).to.deep.equal([
      { title: "Cat's Cradle", author },
      { title: 'Player Piano', author },
    ])
  })

  it('mysql2 should work with a simple query', async () => {
    const author = 'Kurt Vonnegut'
    const query = stt.mysql2`select * from books where author = ${author}`
    const [rows] = await pool.mysql2.query(query)
    expect(rows).to.deep.equal([
      { title: "Cat's Cradle", author },
      { title: 'Player Piano', author },
    ])
  })
})
