import db from "../../database/db.js"
import axios from "axios"


const getNewBuysFromNewPools = async (newPools) => {
	try {
		const newPoolsArrayOfArrays = []
		const newBuys = []

		for (let i = 0; i < newPools.length - 1; i += 10) {
			newPoolsArrayOfArrays.push(newPools.slice(i, i + 10))
		}

		for (let i = 0; i < newPoolsArrayOfArrays.length - 1; i++) {
			const newPoolsArrayOf10 = newPoolsArrayOfArrays[i]

			for (let i = 0; i < newPoolsArrayOf10.length - 1; i++) {
				const poolAddress = newPoolsArrayOf10[i].dataValues.poolAddress
				const tokenAddress = newPoolsArrayOf10[i].dataValues.tokenAddress
				const response = await axios.get(`https://api.geckoterminal.com/api/v2/networks/solana/pools/${poolAddress}/trades`)
				const buys = response.data.data.filter((trade) => { return trade.attributes.kind === "buy" })
				buys.forEach((buy) => {
					newBuys.push({
						buyerAddress: buy.attributes.tx_from_address,
						block: buy.attributes.block_number,
						tokenAddress: tokenAddress,
						poolAddress: poolAddress,
						buyAmountUsd: buy.attributes.volume_in_usd
					})
				})
			}
			await new Promise(resolve => setTimeout(resolve, 0.6 * 60 * 1000))
		}
		return newBuys
	} catch (e) {
		console.log(e)
		return []
	}
}

/* const removeUnnecessaryPools = () => {

} */

const getUniqueTokensFromNewPools = (pools) => {
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


export const saveUniqueBuyersOfTokensInInterval = async () => {
	try {
		const newPools = await db.newPools.findAll()
		const newBuysFromNewPools = await getNewBuysFromNewPools(newPools)
		const tokenAddresses = getUniqueTokensFromNewPools(newPools)

		for (let i = 0; i < tokenAddresses.length - 1; i++) {
			const newUniqueBuyers = []
			const tokenBuys = newBuysFromNewPools.filter((buy) => { return buy.tokenAddress === tokenAddresses[i] })
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