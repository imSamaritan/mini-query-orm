# 🧩 MiniORM — Your Friendly MySQL Query Builder

MiniORM is a minimal, expressive query builder + runner for MySQL, built around `mysql2/promise`. It's designed for control freaks and clean freaks — you write the query, it runs it smartly, and returns results in one chain.

---

## ✨ Features

- Built-in `mysql2` integration — no extra install
- Chainable SQL-style API (`select`, `where`, `order`, `limit`, etc.)
- Automatic `.done()` executor support
- Internal execution strategies (no manual handling)
- Flexible connection via connection string

---

## 🚀 Getting Started

### 1. Install MiniORM

```bash
npm install mini-orm
Note: No need to install mysql2 — it's already bundled.

2. Connect to Your Database
js
Copy
Edit
const { initDB } = require('mini-orm')

const db = initDB("host=localhost;user=root;password=1234;database=mydb;table=students")

const results = await db
  .select(["id", "name"])
  .where({ status: "active" })
  .order({ by: "name" }, "A")
  .limit(10)
  .done()

console.log(results)
🧠 How It Works
initDB(connectionString)
Parses the connection string and connects to your MySQL database using mysql2/promise.

Creates a MiniOrm instance with:

A reference to the selected table (or default one from string)

Internal method handlers from execution.js that match query builders (e.g. .select() triggers exec.select() internally)

🛠 API Methods
.table(name: string)
Sets or switches the current table for query.

.select(columns: string | string[])
Adds SELECT clause.

js
Copy
Edit
.select("email")
.select(["id", "name"])
.selectAll()
Shortcut for SELECT *.

.where(conditions: object)
Adds WHERE clause.

js
Copy
Edit
.where({ id: 1, status: "active" })
.order({ by: string }, direction?: "A" | "D")
Adds ORDER BY. Optional direction: "A" (asc) or "D" (desc)

.limit(count: number, offset?: number)
Adds LIMIT and optional OFFSET.

.done()
Executes the query. Auto-infers which internal execution method to call, based on which query builder was used.

.select() → calls internal exec.select()

.insert() → calls internal exec.insert()

etc.

Returns data from MySQL as a resolved Promise.

🗂 Project Structure
pgsql
Copy
Edit
mini-orm/
├── db/
│   └── db.js                  # mysql2 connection logic
│
├── execution/
│   └── execution.js           # built-in core query executors (e.g., select, insert)
│
├── index.js																	 # entry point, exposes initDB()
│
├── methods/
│   └── methods.js             # query builder methods (.select, .order, etc)
│
├── mini-orm/
│   └── mini-orm.js            # MiniOrm class with reset, props, chaining
│
├── .env                       # optional: define connection string here
└── README.md
🧼 State Management
After every .done() call:

Query is executed using the appropriate internal method from execution.js

The ORM state is reset automatically via .reset():

Props prefixed with $ are cleared

Arrays → []

Objects → {}

Strings → ""

This ensures every query is isolated and clean.

🔮 Coming Soon
.insert(data)

.update(where, data)

.delete(where)

.or(), .like(), .between(), etc.

Model-style interfaces (User.findById())

🔐 Authored By
Built with clarity and hustle by GBeeT
Stay connected: imsamaritan.me

📄 License
MIT — use it, fork it, improve it 💡

yaml
Copy
Edit

---
```
