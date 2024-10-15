import pg from "pg"
import db from "./db.js"
import { env_vars } from "../config/env_vars.js"
import createNewDB from "./createNewDB.js"

const initDb = async () => {
	try {
		const client = new pg.Client(`postgres://${env_vars.DB_USER}:${env_vars.DB_PASSWORD}@${env_vars.DB_HOST}:${env_vars.DB_PORT}/postgres`)
		await client.connect()
		await createNewDB(client)
		await db.sequelize.sync({ alter: true })
		await client.end()
	} catch (e) {
		console.error(e)
	}
}

export default initDb
