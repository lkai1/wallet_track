import { Connection } from "@solana/web3.js";
import { env_vars } from "../../config/env_vars.js"

const connection = new Connection(env_vars.CHAINSTACK_CONNECTION_URL)

export default connection