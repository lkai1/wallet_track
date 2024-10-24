import db from "../../database/db.js";

export const deleteMonthOldBuyers = async () => {
	const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

	await db.buyers.destroy({
		where: {
			createdAt: {
				[db.Sequelize.Op.lt]: oneMonthAgo
			}
		}
	});
	console.log('Deleted Buyer records older than one month')
};