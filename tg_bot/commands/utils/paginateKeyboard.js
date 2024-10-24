import { InlineKeyboard } from "grammy";

export const paginateKeyboard = (page, totalPages) => {
	const keyboard = new InlineKeyboard();

	if (page > 0) {
		keyboard.text('⬅️ Back', `splBuyersPage_${page - 1}`)
	}

	keyboard.text(`${page + 1}/${totalPages}`, 'ignore')

	if (page < totalPages - 1) {
		keyboard.text('Next ➡️', `splBuyersPage_${page + 1}`)
	}

	return keyboard;
};