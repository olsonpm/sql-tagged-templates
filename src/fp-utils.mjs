// these are simplified implementations from 'common-fp'

const assignDefaults = def => obj => {
  const res = { ...obj }

  for (const [k, v] of Object.entries(def)) {
    if (!Object.hasOwn(res, k)) res[k] = v
  }

  return res
}

const isDefined = anything => anything !== undefined

const mapValuesObj = mapperFn => obj => {
  const res = {}
  for (const [k, v] of Object.entries(obj)) {
    res[k] = mapperFn(v, k, obj)
  }
  return res
}

const passThrough = (val, fnArr) => fnArr.reduce((res, fn) => fn(res), val)

const pick = keys => obj => {
  const res = {}
  for (const k of keys) {
    if (k in obj) res[k] = obj[k]
  }
  return res
}

export { assignDefaults, isDefined, mapValuesObj, passThrough, pick }
