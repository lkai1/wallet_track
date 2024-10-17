import { getTokenMetadata } from "../../web3/solana/getTokenMetadata.js"
import { findBuyersOfTheTokens } from "./utils/findBuyersOfTheTokens.js"
import { getBuyersAsCSVStream } from "./utils/getBuyersAsCSVStream.js"
import { InputFile } from "grammy"

export const searchWallets = async (bot) => {

	bot.command("search_wallets", async (context) => {
		try {
			const tokensThatWasFound = []
			const tokenAddresses = context.message.text.split(" ").slice(1)
			if (!tokenAddresses[0]) {
				return context.reply("Please provide token addresses after the /search command.")
			}
			for (let i = 0; i < tokenAddresses.length; i++) {
				const tokenInfo = await getTokenMetadata(tokenAddresses[i])
				if (!tokenInfo) {
					const message = `
		<b>Not found:</b>
${tokenAddresses[i]}
	`
					context.reply(message, { parse_mode: "HTML" })
				} else {
					const message = `
		<b>Found: ${tokenInfo}</b>
${tokenAddresses[i]}
	`
					tokensThatWasFound.push(tokenAddresses[i])
					context.reply(message, { parse_mode: "HTML" })
				}
			}
			if (tokensThatWasFound.length > 0) {
				const message = `
			Searching with the <b>${tokensThatWasFound.length}</b> token(s) that was found.`
				context.reply(message, { parse_mode: "HTML" })
			} else {
				const message = `
				Found <b>${tokensThatWasFound.length}</b> tokens`
				context.reply(message, { parse_mode: "HTML" })
			}
			const buyers = await findBuyersOfTheTokens(tokensThatWasFound)
			if (buyers.length === 0) {
				const message = `
				<b>Found 0 wallets</b>`
				context.reply(message, { parse_mode: "HTML" })
			} else {
				const buyersAsCSVStream = await getBuyersAsCSVStream(buyers)
				const inputFile = new InputFile(buyersAsCSVStream, 'buyers.csv')
				context.replyWithDocument(inputFile, { caption: `Found ${buyers.length} wallets` })
			}
		} catch (e) {
			console.log(e)
			context.reply("There was an error while trying to search wallets. Try again later.")
		}
	})
}