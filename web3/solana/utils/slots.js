import { connection } from "../connection.js"
/* import db from "../../../database/db.js" */

export const getCurrentSlot = async () => {
	const slot = await connection.getSlot("confirmed")
	return slot
}

/* export const getPreviousSlot = async () => {
	const result = await db.previousSlot.findOne()
	return result.slot
}

export const updatePreviousSlotToCurrentSlot = async (currentSlot) => {
	const result = await db.previousSlot.findOne()
	const previousSlot = result
	previousSlot.slot = currentSlot
	await previousSlot.save()
} */