import axios from "axios"
import db from "../../../database/db.js"

const getNewPairs = async () => {
	try {
		const liquidityPools = []
		const URLs = []

		for (let i = 1; i < 11; i++) {
			URLs.push(`https://api.geckoterminal.com/api/v2/networks/solana/new_pools?page=${i}`)
		}

		const responses = await Promise.all(URLs.map((url) => { return axios.get(url) }))

		const pairsFromDatabase = await db.newPair.findAll()

		for (let i = 0; i < responses.length - 1; i++) {
			const data = responses[i].data.data

			for (let i = 0; i < data.length - 1; i++) {
				if ("solana" === data[i].relationships.base_token.data.id.split("_")[0]) {
					const alreadyAdded = !!liquidityPools.find((pool) => { return pool.tokenAddress === data[i].relationships.base_token.data.id.slice(7) })
					const alreadyInDatabase = pairsFromDatabase.find((pair) => {
						return (pair.tokenAddress === data[i].relationships.base_token.data.id.slice(7)
							&& pair.pairAddress === data[i].relationships.quote_token.data.id.slice(7)
							&& pair.dex === data[i].relationships.dex.data.id.slice(7)) ? true : false
					})

					if (!alreadyAdded && !alreadyInDatabase) {
						liquidityPools.push({
							tokenAddress: data[i].relationships.base_token.data.id.slice(7),
							pairAddress: data[i].relationships.quote_token.data.id.slice(7),
							dex: data[i].relationships.dex.data.id,
							creationTime: data[i].attributes.pool_created_at
						})
					}
				}
			}
		}

		const sortedByDateLiquidityPools = liquidityPools.sort((a, b) => { return new Date(b.creationTime) - new Date(a.creationTime) })
		return sortedByDateLiquidityPools
	} catch (e) {
		console.log(e)
		return []
	}
}

export const saveNewPairsInInterval = async () => {
	try {
		const liquidityPools = await getNewPairs()
		await db.newPair.bulkCreate(liquidityPools)
	} catch (e) {
		console.log(e)
	} finally {
		const pollInterval = 15 * 60 * 1000
		setTimeout(() => { return saveNewPairsInInterval() }, pollInterval)
	}
}
