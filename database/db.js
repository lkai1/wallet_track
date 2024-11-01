import Sequelize from "sequelize"
import { Pool } from "./models/Pool.js"
import { Buyer } from "./models/Buyer.js"

const sequelize = new Sequelize.Sequelize("postgresql://postgres:cqsnTahKlBJCsLTZZbYsCEkOuZUqLkCB@postgres.railway.internal:5432/railway", { logging: false })

const db = {}

db.sequelize = sequelize
db.Sequelize = Sequelize;

db.pools = Pool(sequelize)
db.buyers = Buyer(sequelize)

export default db