import axios from 'axios';
import { env_vars } from "../../config/env_vars.js"

export const getTokenMetadata = async (tokenAddress) => {
	try {
		const response = await axios.get(`https://solana-gateway.moralis.io/token/mainnet/${tokenAddress}/metadata`, {
			headers: {
				'accept': 'application/json',
				'X-API-Key': env_vars.MORALIS_API_KEY
			}
		})

		return `${response.data.name} (${response.data.symbol})`

	} catch (e) {
		console.log("Metadata not found for:", tokenAddress)
		return false
	}
}


