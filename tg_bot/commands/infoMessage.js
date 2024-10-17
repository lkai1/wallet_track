
export const infoMessage = (bot) => {

	const message = `
		<b>Add tokens</b>
Search for wallets using /search command followed by space and token addresses separated by space.

Wallet Track bot will return the wallets that were in the first 200 unique buyers of each token you add.
Only newer tokens can be found with greater than 1000$ volume and 1000$ liquidity pool value approximately 1h from the creation of the pool.
Token also has to have had at least 200 unique buyers in the first 30 minutes.
	`
	bot.command("info", (context) => context.reply(message, { parse_mode: "HTML" }))
}
