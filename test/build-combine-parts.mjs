import { expect } from 'chai'
import { mapValues } from 'common-fp'
import dedent from 'dedent'
import buildCombineParts from '#src/build-combine-parts'
import { makeRawSql, spy } from './utils/index.mjs'

const dialect = spy()
dialect.empty = Symbol('empty')

describe('combine-parts', () => {
  const combineParts = buildCombineParts(dialect)
  const defaultOpts = { separator: ', ' }

  afterEach(() => {
    dialect.reset()
  })

  it('returns dialect.empty when no parts are passed', () => {
    const res = combineParts(defaultOpts, [])
    expect(res).to.equal(dialect.empty)
  })

  it('combines the query with one value', () => {
    const options = { before: '(', separator: ', ', after: ')' }
    combineParts(options, [1])
    expect(dialect.argsPerCall).to.deep.equal([[['(', ')'], 1]])
  })

  it('combines the query with two values', () => {
    const options = { before: '(', separator: ', ', after: ')' }
    combineParts(options, [1, 2])
    expect(dialect.argsPerCall).to.deep.equal([[['(', ', ', ')'], 1, 2]])
  })

  it('combines with two values using rawSql just the same', () => {
    const options = mapValues(makeRawSql)({
      before: '(',
      separator: ', ',
      after: ')',
    })
    combineParts(options, [1, 2])
    expect(dialect.argsPerCall).to.deep.equal([[['(', ', ', ')'], 1, 2]])
  })

  describe('expected errors', () => {
    it("throws when options aren't passed", () => {
      expect(() => combineParts()).to.throw(
        'combineClause requires options to be passed'
      )
    })

    it("throws when parts isn't an array", () => {
      expect(() => combineParts({})).to.throw(
        'combineClause requires parts to be an array'
      )
    })

    it("throws when options.separator isn't defined", () => {
      expect(() => combineParts({}, [])).to.throw(
        'combineClause requires options.separator to be defined'
      )
    })

    it("throws when options passed aren't valid", () => {
      const expectedErrMsg = dedent(`
        combineClause requires options to either be strings or rawSql instances.  The following options passed are invalid.
         - before
         - separator
         - after
      `)
      const options = {
        before: 1,
        separator: 1,
        after: 1,
      }
      expect(() => combineParts(options, [])).to.throw(expectedErrMsg)
    })

    it('throws when options.separator is an empty string', () => {
      const options = {
        separator: '',
      }
      expect(() => combineParts(options, [])).to.throw(
        'combineClause requires options.separator to be a truthy string'
      )
    })
  })
})
