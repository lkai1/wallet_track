import express from "express"
import bot from "./tg_bot/bot.js"
import { saveNewPairsInInterval } from "./web3/solana/utils/newPairs.js"
import initDb from "./database/initDb.js"

const app = express()

app.use(express.json())

initDb().then(() => {
	app.listen(3001, () => {
		console.log("App is running on port 3001...")
		saveNewPairsInInterval()
		bot()
	})
}).catch((e) => { console.log(e) })
