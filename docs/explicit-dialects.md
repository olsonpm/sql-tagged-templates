## Explicit Dialects

Dialects in sql-tagged-templates are explicit

You have the option of either named exports:

```js
import * as stt from 'sql-tagged-templates'

stt.mariadb`select * from books`
stt.mysql2`select * from books`

stt.pg`select * from books`

stt.sequelize`select * from books`
stt.sequelize.bound`select * from books`
```

Or subpath

```js
import stt from 'sql-tagged-templates/mariadb'
import stt from 'sql-tagged-templates/mysql2'
import stt from 'sql-tagged-templates/pg'

import stt, { bound } from 'sql-tagged-templates/sequelize'
// for sequelize, stt.bound === bound
```
