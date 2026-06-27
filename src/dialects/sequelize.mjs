import makeDialect from '../make-dialect.mjs'

const stt = makeDialect({ placeholderType: 'ordered', stringName: 'query' })

const bound = makeDialect({
  placeholderType: 'numbered',
  stringName: 'query',
  valuesName: 'bind',
})

stt.bound = bound

export default stt
export { bound }
