import Sequelize from "sequelize"
import { NewPool } from "./models/NewPool.js"
import { Buyer } from "./models/Buyer.js"

const sequelize = new Sequelize.Sequelize(`postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`, { logging: false })

const db = {}

db.sequelize = sequelize
db.Sequelize = Sequelize;

db.newPools = NewPool(sequelize)
db.buyers = Buyer(sequelize)

export default db