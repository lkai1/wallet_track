import axios from 'axios';
import { env_vars } from "../../config/env_vars.js"
import db from '../../database/db.js';

export const getTokenMetadata = async (tokenAddress) => {
	try {
		const tokenFound = !!await db.buyers.findOne({ where: { tokenAddress: tokenAddress } })
		if (!tokenFound) {
			return false
		}
		const response = await axios.get(`https://solana-gateway.moralis.io/token/mainnet/${tokenAddress}/metadata`, {
			headers: {
				'accept': 'application/json',
				'X-API-Key': env_vars.MORALIS_API_KEY
			}
		})

		return `${response.data.name} (${response.data.symbol})`

	} catch (e) {
		console.log(e)
		return ("")
	}
};


