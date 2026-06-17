import db from '../db/database'

export const transactionService = {

    async create(data) {

    if (!data) {
        throw new Error('Data transaksi kosong')
    }

    if (!data.items?.length) {
        throw new Error('Item transaksi kosong')
    }

    if (!data.total) {
        throw new Error('Total transaksi tidak valid')
    }

    return await db.transactions.add({

    ...data,

    createdAt:
        data.createdAt ||
        new Date()

})

},

    async getAll() {
        return await db.transactions.toArray()
    }

}