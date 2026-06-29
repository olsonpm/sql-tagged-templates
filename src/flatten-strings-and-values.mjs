import { isRawSql, symbols as s } from './utils.mjs'

const flattenStringsAndValues = ({ strings, values }) => {
  const strsCopy = [...strings]
  const valsCopy = [...values]

  const flat = {
    strings: [strsCopy.shift()],
    values: [],
  }

  while (valsCopy.length) {
    const val = valsCopy.shift()
    if (isRawSql(val)) {
      const lastStrIdx = flat.strings.length - 1
      flat.strings[lastStrIdx] += val[s.rawSql] + strsCopy.shift()
    } else if (val[s.isQuery]) {
      const nested = flattenStringsAndValues({
        strings: val[s.strings],
        values: val[s.values],
      })

      let lastStrIdx = flat.strings.length - 1

      flat.strings[lastStrIdx] += nested.strings.shift()
      flat.strings.push(...nested.strings)
      flat.values.push(...nested.values)

      lastStrIdx = flat.strings.length - 1
      flat.strings[lastStrIdx] += strsCopy.shift()
    } else {
      flat.values.push(val)
      flat.strings.push(strsCopy.shift())
    }
  }

  return flat
}

export default flattenStringsAndValues
