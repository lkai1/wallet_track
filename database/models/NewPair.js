import { DataTypes } from "sequelize";

export const NewPair = (sequelize) => {
	return sequelize.define("NewPair", {
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
		pairAddress: {
			type: DataTypes.STRING,
			allowNull: false
		},
		dex: {
			type: DataTypes.STRING,
			allowNull: false
		},
		creationTime: {
			type: DataTypes.DATE,
			allowNull: false
		}
	}, {
		timestamps: false
	})
}
