import { env_vars } from "../config/env_vars.js"

const createNewDB = async (client) => {
	try {
		const result = await client.query(
			`SELECT EXISTS(SELECT datname FROM pg_catalog.pg_database WHERE datname = '${env_vars.DB_NAME}');`
		)
		if (!result.rows[0].exists) {
			await client.query(`CREATE DATABASE ${env_vars.DB_NAME}`)
		}
	} catch (e) {
		console.error(e)
	}
}

export default createNewDB