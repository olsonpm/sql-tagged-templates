import { Dialect } from '../common-types.ts'

type MariadbQuery = { sql: string; values: unknown[] }

declare const mariadb: Dialect<MariadbQuery>

export default mariadb
