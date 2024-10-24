import express from "express"
import bot from "./tg_bot/bot.js"
import { saveNewPoolsInInterval } from "./web3/solana/pools.js"
import initDb from "./database/initDb.js"
import { saveUniqueBuyersOfTokensInInterval } from "./web3/solana/buys.js"
import cron from "node-cron"
import { deleteMonthOldBuyers } from "./web3/solana/deleteMonthOldBuyers.js"

const app = express()

app.use(express.json())

initDb().then(() => {
	cron.schedule('0 0 * * *', async () => {
		await deleteMonthOldBuyers()
	})
	app.listen(3001, () => {
		console.log("App is running on port 3001")
		saveNewPoolsInInterval()
		saveUniqueBuyersOfTokensInInterval()
		bot()
	})
}).catch((e) => { console.log(e) })
