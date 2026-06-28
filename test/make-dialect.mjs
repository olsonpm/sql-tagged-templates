import { expect } from 'chai'
import makeDialect from '#src/make-dialect'
import { symbols as s } from '#src/utils'
// import { makeRawSql, makeShallowQuery } from './utils.mjs'

const author = 'Kurt Vonnegut'

describe('make-dialect', () => {
  it('makes a dialect with placholderType "numbered" and query string named "text"', () => {
    const stt = makeDialect({
      placeholderType: 'numbered',
      stringName: 'text',
    })

    const query = stt`select * from books where author = ${author}`

    expect(query.text).to.equal('select * from books where author = $1')
    expect(query.values).to.deep.equal([author])
  })

  it('makes a dialect with placholderType "ordered" and query string named "sql"', () => {
    const stt = makeDialect({
      placeholderType: 'ordered',
      stringName: 'sql',
    })

    const query = stt`select * from books where author = ${author}`

    expect(query.sql).to.equal('select * from books where author = ?')
    expect(query.values).to.deep.equal([author])
  })

  it('makes a dialect with the values assigned to "bind"', () => {
    const stt = makeDialect({
      placeholderType: 'numbered',
      stringName: 'query',
      valuesName: 'bind',
    })

    const query = stt`select * from books where author = ${author}`

    expect(query.bind).to.deep.equal([author])
  })
})

describe('dialect', () => {
  const stt = makeDialect({
    placeholderType: 'numbered',
    stringName: 'text',
  })

  it('can produce a raw sql object', () => {
    const raw = stt.raw('name')

    expect(raw).to.deep.equal({ rawSql: 'name', [s.isRawSql]: true })
  })

  it('throws when attempting to call raw as a tagged template', () => {
    expect(() => stt.raw`name`).to.throw(
      /^raw is a function, not a tagged template/
    )
  })

  it('exposes an empty sql object', () => {
    expect(stt.empty).to.deep.equal({ rawSql: '', [s.isRawSql]: true })
  })

  it('handles a query with no values', () => {
    const query = stt`select * from books`
    expect(query).to.deep.include({
      text: 'select * from books',
      values: [],
    })
  })

  it('handles a query with one value', () => {
    const query = stt`select * from books where author = ${author}`
    expect(query).to.deep.include({
      text: 'select * from books where author = $1',
      values: [author],
    })
  })

  it('handles a query with raw sql', () => {
    const column = stt.raw('name')
    const query = stt`select ${column} from books`
    expect(query).to.deep.include({
      text: 'select name from books',
      values: [],
    })
  })

  it('handles a query with empty raw sql', () => {
    const where = stt.empty
    const query = stt`select name from books ${where}`
    expect(query).to.deep.include({
      text: 'select name from books ',
      values: [],
    })
  })

  it('handles a single nested query', () => {
    const where = stt`where author = ${author}`
    const query = stt`select name from books ${where}`
    expect(query).to.deep.include({
      text: 'select name from books where author = $1',
      values: [author],
    })
  })

  it('handles a double nested query', () => {
    const title = "Cat's Cradle"
    const and = stt`and title = ${title}`
    const where = stt`where author = ${author} ${and}`
    const query = stt`select name from books ${where}`
    expect(query).to.deep.include({
      text: 'select name from books where author = $1 and title = $2',
      values: [author, title],
    })
  })
})
