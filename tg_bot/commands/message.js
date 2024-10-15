

export const message = (bot) => {
	bot.on("message", async (context) => {
		context.reply("Success")
	})
}