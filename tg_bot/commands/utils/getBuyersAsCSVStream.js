import { stringify } from "csv-stringify"
import { PassThrough } from 'stream'

export const getBuyersAsCSVStream = (buyerAddresses) => {
	return new Promise((resolve, reject) => {
		const csvData = [["Buyer address"], ...buyerAddresses.map((address) => { return [address] })]

		stringify(csvData, (error, output) => {
			if (error) {
				reject(error)
			} else {
				const stream = new PassThrough()
				stream.end(Buffer.from(output, 'utf-8'))
				resolve(stream);
			}
		})
	})
}