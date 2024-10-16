import { DataTypes } from "sequelize";

export const Buyer = (sequelize) => {
	return sequelize.define("Buyer", {
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			unique: true,
			primaryKey: true
		},
		tokenAddress: {
			type: DataTypes.STRING,
			allowNull: false
		},
		buyerAddress: {
			type: DataTypes.STRING,
			allowNull: false
		},
		buyAmountUsd: {
			type: DataTypes.STRING,
			allowNull: false
		}
	}, {
		timestamps: false
	})
}