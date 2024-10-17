import db from "../../../database/db.js"

export const findBuyersOfTheTokens = async (tokenAddresses) => {
	try {
		const buyers = await db.buyers.findAll({
			where: {
				tokenAddress: {
					[db.Sequelize.Op.in]: tokenAddresses
				}
			},
			attributes: ['buyerAddress'],
			group: ['buyerAddress'],
			having: db.Sequelize.where(
				db.Sequelize.fn('COUNT', db.Sequelize.fn('DISTINCT', db.Sequelize.col('tokenAddress'))),
				tokenAddresses.length
			),
			raw: true
		});

		return buyers.map((buyer) => { return buyer.buyerAddress })
	} catch (e) {
		console.error(e)
		return []
	}
}