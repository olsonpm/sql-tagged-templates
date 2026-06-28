# Migrating From SQL Template Strings

<br>

## Table Of Contents

<!-- toc -->

- [Update your database libraries](#update-your-database-libraries)
- [Update your node version](#update-your-node-version)
- [Update your code](#update-your-code)
  - [Update your project to use ESM](#update-your-project-to-use-esm)
  - [Import your dialect](#import-your-dialect)
  - [Remove `sts.append`](#remove-stsappend)
  - [Remove `query.useBind`](#remove-queryusebind)
  - [Remove `setName`](#remove-setname)
  - [Remove `SQL` named imports](#remove-sql-named-imports)
  - [Remove references to SQLStatement](#remove-references-to-sqlstatement)

<!-- tocstop -->

<br>

## Update your database libraries

sql-tagged-templates only supports the latest major versions of each database
library. [These are listed here][supported-db-libs]

- Note if you were on the older [mysql][mysql] library, you'll need to update it
  to [mysql2][mysql2] or [mariadb][mariadb]

<br>

## Update your node version

We only support LTS versions of node. As of writing, that means node v22+ so
you'll have to get up to date.

<br>

## Update your code

<br>

### Update your project to use ESM

Find resources online for how to do this. In the end, you need to be able to
import this library instead of require it. e.g.

```js
// before
const sts = require('sql-template-strings')

// after - make sure to import the dialect you're using
import stt from 'sql-tagged-templates/mariadb'
```

<br>

### Import your dialect

Instead of a single query builder fit for all dialects, sql-tagged-templates
exports them individually.

```js
// before
import sts from 'sql-template-strings'

postgresPool.query(sts`select * from books`)

// after
import stt from 'sql-template-strings/pg'

postgresPool.query(stt`select * from books`)
```

<br>

### Remove `sts.append`

1. Instead of append, [we now nest templates][nesting] to build queries

2. [Raw strings are explicit now][raw-usage]

3. Instead of conditionally calling append, [use `.empty` for conditional SQL][empty-usage]

<br>

### Remove `query.useBind`

[We export a function `bound` instead][bound-usage]

<br>

### Remove `setName`

Set the 'name' property on the query instead e.g.

```js
// before
const query = sts`select * from books`
query.setName('my-prepared-statement')

// after
import stt from 'sql-tagged-templates/pg'

const query = stt`select * from books`
query.name = 'my-prepared-statement'
```

<br>

### Remove `SQL` named imports

Alias the import instead

```js
// before
import { SQL } from 'sql-template-strings'

const query = SQL`select * from books`

// after

// either named or default
import SQL from 'sql-tagged-templates/pg'
import { pg as SQL } from 'sql-tagged-templates'

const query = SQL`select * from books`
```

<br>

### Remove references to SQLStatement

It's not possible for me to write a guide for this since you could be doing
anything with that class.

From a broader perspective, classes are stateful and sql-tagged-templates is
stateless, meaning an approach using classes won't work. So you'll have to
approach your problem in an immutable way.

[bound-usage]: ./more-usage-info.md#bound-statements-in-sequelize
[empty-usage]: ./more-usage-info.md#conditionally-add-sql
[mariadb]: https://www.npmjs.com/package/mariadb
[mysql]: https://www.npmjs.com/package/mysql
[mysql2]: https://www.npmjs.com/package/mysql2
[nesting]: ./more-usage-info.md#building-complex-queries-with-nesting
[raw-usage]: ./more-usage-info.md#raw-values
[supported-db-libs]: ../readme.md#what-database-libraries-are-supported
