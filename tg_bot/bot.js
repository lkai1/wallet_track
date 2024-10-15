import { Bot } from "grammy"
import { env_vars } from "../config/env_vars.js"
import { start } from "./commands/start.js"
import { message } from "./commands/message.js"

const bot = new Bot(env_vars.TG_BOT_TOKEN)

start(bot)
message(bot)
bot.catch((e) => { console.log(e) })

export default () => { bot.start() }