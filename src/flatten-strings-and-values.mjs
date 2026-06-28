import { symbols as s } from './utils.mjs'

const flattenStringsAndValues = ({ strings, values }) => {
  const strsCopy = [...strings]
  const valsCopy = [...values]

  const flat = {
    strings: [strsCopy.shift()],
    values: [],
  }

  while (valsCopy.length) {
    const val = valsCopy.shift()
    if (val[s.isRawSql]) {
      const lastStrIdx = flat.strings.length - 1
      flat.strings[lastStrIdx] += val.rawSql + strsCopy.shift()
    } else if (val[s.isQuery]) {
      const nested = flattenStringsAndValues({
        strings: val[s.strings],
        values: val[s.values],
      })

      const lastStrIdx = flat.strings.length - 1

      if (nested.strings.length > 1) {
        const firstNestedStr = nested.strings.shift()
        const lastNestedStr = nested.strings.pop()
        const midNestedStrs = nested.strings

        flat.strings[lastStrIdx] += firstNestedStr
        flat.strings.push(...midNestedStrs, lastNestedStr + strsCopy.shift())
        flat.values.push(...nested.values)
      } else {
        // nested.strings.length must be 1, which means values is empty
        flat.strings[lastStrIdx] += nested.strings[0] + strsCopy.shift()
      }
    } else {
      flat.values.push(val)
      flat.strings.push(strsCopy.shift())
    }
  }

  return flat
}

export default flattenStringsAndValues
