import { getAllAccountsByTokenMintAddress } from "../../web3/solana/getAccounts.js"

export const message = (bot) => {
	bot.on("message", async (context) => {
		const accounts = await getAllAccountsByTokenMintAddress()
		context.reply("Success")
	})
}