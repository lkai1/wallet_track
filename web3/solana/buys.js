import db from "../../database/db.js"
import axios from "axios"
import { env_vars } from "../../config/env_vars.js"


const getNewBuysFromPools = async (pools) => {
	try {
		const poolsArrayOfArrays = []
		const newBuys = []

		for (let i = 0; i < pools.length; i += 10) {
			poolsArrayOfArrays.push(pools.slice(i, i + 10))
		}

		for (let i = 0; i < poolsArrayOfArrays.length; i++) {
			const poolsArrayOf10 = poolsArrayOfArrays[i]

			for (let i = 0; i < poolsArrayOf10.length; i++) {
				const poolAddress = poolsArrayOf10[i].dataValues.poolAddress
				const tokenAddress = poolsArrayOf10[i].dataValues.tokenAddress

				const response = await axios.get(`https://pro-api.coingecko.com/api/v3/onchain/networks/solana/pools/${poolAddress}/trades`, {
					headers: {
						"accept": "application/json",
						"x-cg-pro-api-key": env_vars.COINGECKO_API_KEY
					}
				})

				const buys = response.data.data.filter((trade) => { return trade.attributes.kind === "buy" })

				buys.forEach((buy) => {
					if (Number(buy.attributes.volume_in_usd) > 5) {
						newBuys.push({
							buyerAddress: buy.attributes.tx_from_address,
							block: buy.attributes.block_number,
							tokenAddress: tokenAddress,
							poolAddress: poolAddress,
							buyAmountUsd: buy.attributes.volume_in_usd
						})
					}
				})
			}
			await new Promise(resolve => setTimeout(resolve, 0.045 * 60 * 1000))
		}
		return newBuys
	} catch (e) {
		console.log(e)
		return []
	}
}

const getUniqueTokensFromPools = (pools) => {
	try {
		const uniqueTokens = []

		pools.forEach((pool) => {
			if (!uniqueTokens.includes(pool.dataValues.tokenAddress)) {
				uniqueTokens.push(pool.dataValues.tokenAddress)
			}
		})

		return uniqueTokens
	} catch (e) {
		console.log(e)
		return []
	}
}

const deleteNotNeededPoolsAndBuyers = async () => {
	const poolsOlderThan1Hour = await db.pools.findAll({
		where: {
			creationTime: {
				[db.Sequelize.Op.lt]: new Date(Date.now() - 60 * 60 * 1000).toISOString()
			}
		}
	})

	for (const pool of poolsOlderThan1Hour) {
		const buyerCount = await db.buyers.count({
			where: {
				tokenAddress: pool.dataValues.tokenAddress
			}
		})

		if (buyerCount < 200) {
			await db.pools.destroy({ where: { tokenAddress: pool.dataValues.tokenAddress } })
			await db.buyers.destroy({ where: { tokenAddress: pool.dataValues.tokenAddress } })

		} else if (buyerCount === 200) (
			await db.pools.destroy({ where: { tokenAddress: pool.dataValues.tokenAddress } })
		)
	}
}


const saveUniqueBuyersOfTokens = async () => {
	try {
		const pools = await db.pools.findAll()
		const newBuysFromPools = await getNewBuysFromPools(pools)
		const tokenAddresses = getUniqueTokensFromPools(pools)

		for (let i = 0; i < tokenAddresses.length; i++) {
			const newUniqueBuyers = []
			const tokenBuys = newBuysFromPools.filter((buy) => { return buy.tokenAddress === tokenAddresses[i] })
			const tokenBuysSortedByBlock = tokenBuys.sort((a, b) => { return a.block - b.block })
			const tokenBuyersFromDatabase = await db.buyers.findAll({ where: { tokenAddress: tokenAddresses[i] } })

			for (let i = 0; i < tokenBuysSortedByBlock.length && (newUniqueBuyers.length + tokenBuyersFromDatabase.length) < 200; i++) {
				const alreadyAdded = !!newUniqueBuyers.find((buyer) => { return buyer.buyerAddress === tokenBuysSortedByBlock[i].buyerAddress })
				const alreadyInDatabase = !!tokenBuyersFromDatabase.find((buyer) => { return buyer.dataValues.buyerAddress === tokenBuysSortedByBlock[i].buyerAddress })

				if (!alreadyAdded && !alreadyInDatabase) {
					newUniqueBuyers.push({
						buyerAddress: tokenBuysSortedByBlock[i].buyerAddress,
						tokenAddress: tokenBuysSortedByBlock[i].tokenAddress,
						buyAmountUsd: tokenBuysSortedByBlock[i].buyAmountUsd
					})
				}
			}
			await db.buyers.bulkCreate(newUniqueBuyers)
		}
	} catch (e) {
		console.log(e)
	}
}

export const saveUniqueBuyersOfTokensInInterval = async () => {
	try {
		await deleteNotNeededPoolsAndBuyers()
		await saveUniqueBuyersOfTokens()
	} catch (e) {
		console.log(e)
	} finally {
		const pollInterval = 3 * 60 * 1000
		setTimeout(() => { return saveUniqueBuyersOfTokensInInterval() }, pollInterval)
	}
}