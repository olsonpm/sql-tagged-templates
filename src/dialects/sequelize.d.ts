import { Dialect } from '../common-types.ts'

type SequelizeQuery = { query: string; values: unknown[] }
type SequelizeBoundQuery = { query: string; bind: unknown[] }

type SequlizeBoundDialect = Dialect<SequelizeBoundQuery>

declare const bound: SequlizeBoundDialect
declare const sequelize: Dialect<SequelizeQuery> & {
  bound: SequlizeBoundDialect
}

export default sequelize
export { bound }
