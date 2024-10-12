import connection from "./connection.js";
import { PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

export const getAllAccountsByTokenMintAddress = async (tokenMint) => {
	try {
		const tokenMintPublicKey = new PublicKey(tokenMint);
		const accounts = await connection.getParsedProgramAccounts(
			TOKEN_PROGRAM_ID,
			{
				filters: [
					{
						dataSize: 165
					},
					{
						memcmp: {
							offset: 0,
							bytes: tokenMintPublicKey
						},
					},
				],
			}
		)

		console.log(accounts.length)
		console.log(accounts[1270].account.data.parsed)

	} catch (e) {
		console.error("Error fetching accounts:", e);
	}
};

export const getFirstWalletsToReceiveToken = async () => {

}
