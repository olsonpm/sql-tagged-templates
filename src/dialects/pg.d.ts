import { Dialect } from '../common-types.ts'

type PgQuery = { text: string; values: unknown[] }

declare const pg: Dialect<PgQuery>

export default pg
