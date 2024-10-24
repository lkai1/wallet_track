
export const startMessage = (bot) => {

	const message = `
		<b>Info</b>
Search for wallets using /search_wallets command followed by space and token addresses separated by space.

The bot will return the wallets that were in the first 200 unique buyers of all the tokens.
Only newer tokens can be found with greater than 1000$ volume and 1000$ liquidity pool value approximately 1h from the creation of the pool.
Token also has to have had at least 200 unique buyers in the first 1 hour.
	`
	bot.command("start", (context) => context.reply(message, { parse_mode: "HTML" }))
}