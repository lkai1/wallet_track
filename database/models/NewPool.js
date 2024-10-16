import { DataTypes } from "sequelize";

export const NewPool = (sequelize) => {
	return sequelize.define("NewPool", {
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			unique: true,
			primaryKey: true
		},
		poolAddress: {
			type: DataTypes.STRING,
			allowNull: false
		},
		tokenAddress: {
			type: DataTypes.STRING,
			allowNull: false
		},
		pairAddress: {
			type: DataTypes.STRING,
			allowNull: false
		},
		creationTime: {
			type: DataTypes.STRING,
			allowNull: false
		}
	}, {
		timestamps: false
	})
}
