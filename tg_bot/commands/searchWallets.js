import { getTokenMetadata } from "../../web3/solana/getTokenMetadata.js"
import { findBuyersOfTheTokens } from "./utils/findBuyersOfTheTokens.js"
import { paginate } from "./utils/paginate.js"
import { paginateKeyboard } from "./utils/paginateKeyboard.js"
import db from "../../database/db.js"

export const searchWallets = async (bot) => {

	bot.command("search_wallets", async (context) => {
		try {
			const tokensThatWasFound = []
			const tokenAddresses = context.message.text.split(" ").slice(1)

			if (!tokenAddresses[0]) {
				return await context.reply("Please provide token addresses after the /search_wallets command.")
			}

			if (tokenAddresses.length > 5) {
				return await context.reply("Max. amount of token addresses is 5.")
			}

			let foundTokensMessagePart = ""
			let notFoundTokensMessagePart = ""

			for (let i = 0; i < tokenAddresses.length; i++) {
				const tokenFound = !!(await db.buyers.findOne({ where: { tokenAddress: tokenAddresses[i] } }))

				if (!tokenFound) {
					const message = `<b>Not found:</b>
${tokenAddresses[i]}\n\n`
					notFoundTokensMessagePart += message

				} else {
					const tokenInfo = await getTokenMetadata(tokenAddresses[i])
					const message = `<b>Found: ${tokenInfo ? tokenInfo : "Unknown"}</b>
${tokenAddresses[i]}\n\n`
					tokensThatWasFound.push(tokenAddresses[i])

					foundTokensMessagePart += message

				}
			}

			let foundTokensMessage = foundTokensMessagePart + notFoundTokensMessagePart

			if (tokensThatWasFound.length > 0) {
				const message = `Searching with the <b>${tokensThatWasFound.length}</b> token(s) that was found.`
				foundTokensMessage += message

			} else {
				const message = `Found <b>${tokensThatWasFound.length}</b> tokens`
				foundTokensMessage += message
			}

			await context.reply(foundTokensMessage, { parse_mode: "HTML" })

			const buyers = await findBuyersOfTheTokens(tokensThatWasFound)

			if (buyers.length === 0) {
				const message = `<b>Found 0 wallets</b>`
				await context.reply(message, { parse_mode: "HTML" })

			} else {
				const first10Buyers = paginate(buyers, 0, 10)

				await context.reply(`<b>Found ${buyers.length} wallet(s)</b>\n\n${first10Buyers.join('\n\n')}`, {
					reply_markup: paginateKeyboard(0, Math.ceil(buyers.length / 10)),
					reply_to_message_id: context.message.message_id,
					parse_mode: "HTML"
				})
			}
		} catch (e) {
			console.log(e)
			context.reply("There was an error while trying to search wallets. Try again later.")
		}
	})

	bot.on('callback_query:data', async (context) => {
		try {
			const callbackData = context.callbackQuery.data

			if (!context.callbackQuery.message.reply_to_message) {
				return context.answerCallbackQuery({ text: "No original message found.", show_alert: true })
			}

			const originalMessage = context.callbackQuery.message.reply_to_message
			const tokenAddresses = originalMessage.text.split(" ").slice(1)
			const tokensThatWasFound = []


			for (let i = 0; i < tokenAddresses.length; i++) {
				const tokenFound = !!(await db.buyers.findOne({ where: { tokenAddress: tokenAddresses[i] } }))
				if (tokenFound) {
					tokensThatWasFound.push(tokenAddresses[i])
				}
			}

			if (callbackData.startsWith('splBuyersPage_')) {
				const buyers = await findBuyersOfTheTokens(tokensThatWasFound)
				const pageIndex = Number(callbackData.split('_')[1])
				const currentPageItems = paginate(buyers, pageIndex, 10)

				await context.editMessageText(`<b>Found ${buyers.length} wallet(s)</b>\n\n${currentPageItems.join('\n\n')}`, {
					reply_markup: paginateKeyboard(pageIndex, Math.ceil(buyers.length / 10)),
					parse_mode: "HTML"
				})

				return context.answerCallbackQuery()
			}

		} catch (e) {
			console.log(e)
			context.reply("Can't change page. Maybe one the tokens is not available on the server anymore.", {
				reply_to_message_id: context.message.message_id
			})
		}
	})
}