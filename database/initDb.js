import pg from "pg"
import db from "./db.js"

const initDb = async () => {
	try {
		const client = new pg.Client("postgresql://postgres:NzhRUfFpTaXEApquhkAyGtTPFvEluwnj@postgres.railway.internal:5432/railway")
		await client.connect()
		await db.sequelize.sync({ alter: true })
		await client.end()
	} catch (e) {
		console.error(e)
	}
}

export default initDb
