import axios from "axios"
import db from "../../database/db.js"

const getNewPools = async () => {
	try {
		const liquidityPools = []
		const URLs = []

		for (let i = 1; i < 11; i++) {
			URLs.push(`https://api.geckoterminal.com/api/v2/networks/solana/new_pools?page=${i}`)
		}

		const responses = await Promise.all(URLs.map((url) => { return axios.get(url) }))

		const poolsFromDatabase = await db.newPools.findAll()

		for (let i = 0; i < responses.length - 1; i++) {
			const data = responses[i].data.data

			for (let i = 0; i < data.length - 1; i++) {
				if ("solana" === data[i].relationships.base_token.data.id.split("_")[0]) {
					const alreadyAdded = !!liquidityPools.find((pool) => { return pool.poolAddress === data[i].attributes.address })
					const alreadyInDatabase = !!poolsFromDatabase.find((pool) => { return pool.dataValues.poolAddress === data[i].attributes.address })

					const enoughVolume = (
						Number(data[i].attributes.volume_usd.m5) > 1000
						|| Number(data[i].attributes.volume_usd.h1) > 1000
						|| Number(data[i].attributes.volume_usd.h6) > 1000
						|| Number(data[i].attributes.volume_usd.h24) > 1000
					) ? true : false

					const enoughLiquidity = Number(data[i].attributes.reserve_in_usd) > 1000

					if (!alreadyAdded && !alreadyInDatabase && enoughVolume && enoughLiquidity) {
						liquidityPools.push({
							poolAddress: data[i].attributes.address,
							tokenAddress: data[i].relationships.base_token.data.id.slice(7),
							pairAddress: data[i].relationships.quote_token.data.id.slice(7),
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

export const saveNewPoolsInInterval = async () => {
	//make interval self changing based on new pools in an hour
	try {
		const liquidityPools = await getNewPools()
		await db.newPools.bulkCreate(liquidityPools)
	} catch (e) {
		console.log(e)
	} finally {
		const pollInterval = 15 * 60 * 1000
		setTimeout(() => { return saveNewPoolsInInterval() }, pollInterval)
	}
}
