import express from "express"
import bot from "./tg_bot/bot.js"

const app = express()

app.use(express.json())

app.listen(3001, () => {
	console.log("App is running on port 3001")
	bot()
})