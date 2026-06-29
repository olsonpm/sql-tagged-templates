import { expect } from 'chai'
import flattenStringsAndValues from '#src/flatten-strings-and-values'
import { makeRawSql, makeShallowQuery } from './utils/index.mjs'

describe('flatten-strings-and-values', () => {
  it('handles simplest case of one string', () => {
    const res = flattenStringsAndValues({
      strings: ['some string'],
      values: [],
    })
    expect(res).to.deep.equal({ strings: ['some string'], values: [] })
  })

  it('creates new arrays', () => {
    const input = { strings: ['some string'], values: [] }
    const res = flattenStringsAndValues(input)
    expect(input.strings).to.not.equal(res.strings)
    expect(input.values).to.not.equal(res.values)
  })

  it('handles case of two strings one value', () => {
    const res = flattenStringsAndValues({
      strings: ['some string', 'other string'],
      values: [1],
    })
    expect(res).to.deep.equal({
      strings: ['some string', 'other string'],
      values: [1],
    })
  })

  it('handles raw sql', () => {
    const columnName = makeRawSql('title')
    const res = flattenStringsAndValues({
      strings: ['select ', ' from books'],
      values: [columnName],
    })
    expect(res).to.deep.equal({
      strings: ['select title from books'],
      values: [],
    })
  })

  it('handles query', () => {
    const query = makeShallowQuery(['where author = ', ''], 'Kurt Vonnegut')
    const res = flattenStringsAndValues({
      strings: ['select * from books\n', ''],
      values: [query],
    })
    expect(res).to.deep.equal({
      strings: ['select * from books\nwhere author = ', ''],
      values: ['Kurt Vonnegut'],
    })
  })

  it('handles empty query', () => {
    const emptyQuery = makeShallowQuery([''])
    const res = flattenStringsAndValues({
      strings: ['select * from books\n', ''],
      values: [emptyQuery],
    })
    expect(res).to.deep.equal({
      strings: ['select * from books\n'],
      values: [],
    })
  })
})
