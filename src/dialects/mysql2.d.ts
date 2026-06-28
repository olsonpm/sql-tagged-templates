import { Dialect } from '../common-types.ts'

type Mysql2Query = { sql: string; values: unknown[] }

declare const mysql2: Dialect<Mysql2Query>

export default mysql2
