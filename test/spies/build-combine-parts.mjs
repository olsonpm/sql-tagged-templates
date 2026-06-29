import { replace } from 'fibble'
import { spy } from '../utils/index.mjs'
import buildCombineParts from '#src/build-combine-parts'

const pathToModule = '../../src/build-combine-parts.mjs'

const buildCombinePartsSpy = spy((...args) => {
  const combineParts = buildCombineParts(...args)
  return spy(combineParts)
})
await replace(pathToModule, { default: buildCombinePartsSpy })

export default buildCombinePartsSpy
