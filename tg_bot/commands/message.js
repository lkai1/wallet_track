import { saveUniqueBuyersOfTokensInInterval } from "../../web3/solana/buys.js"


export const message = (bot) => {
	bot.on("message", async (context) => {
		await saveUniqueBuyersOfTokensInInterval()
		context.reply("Success")
	})
}