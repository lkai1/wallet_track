import express from "express"
import bot from "./tg_bot/bot.js"
import { saveNewPoolsInInterval } from "./web3/solana/newPools.js"
import initDb from "./database/initDb.js"

const app = express()

app.use(express.json())

initDb().then(() => {
	app.listen(3001, () => {
		console.log("App is running on port 3001...")
		saveNewPoolsInInterval()
		bot()
	})
}).catch((e) => { console.log(e) })
