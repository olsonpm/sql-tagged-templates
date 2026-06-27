## Explicit Dialects

Dialects in sql-tagged-templates are explicit

You have the option of either named exports:

```js
import * as stt from 'sql-tagged-templates'

stt.mysql2`select * from my_table`

stt.pg`select * from my_table`

stt.sequelize`select * from my_table`
stt.sequelize.bound`select * from my_table`
```

Or subpath

```js
import stt from 'sql-tagged-templates/mysql2'
import stt from 'sql-tagged-templates/pg'

import stt, { bound } from 'sql-tagged-templates/sequelize'
// for sequelize, stt.bound === bound
```
