import { Bot } from "grammy"
import { env_vars } from "../config/env_vars.js"
import { infoMessage } from "./commands/infoMessage.js"
import { searchWallets } from "./commands/searchWallets.js"

const bot = new Bot(env_vars.TG_BOT_TOKEN)

infoMessage(bot)
searchWallets(bot)
await bot.api.setMyCommands([
	{ command: "info", description: "Show introduction" },
	{ command: "search_wallets", description: "Search wallets" },
]);
bot.catch((e) => { console.log(e) })

export default () => { bot.start() }