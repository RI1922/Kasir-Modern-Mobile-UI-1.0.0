import db from '../db/database'

export const transactionService = {

    async create(data) {
        return await db.transactions.add(data)
    },

    async getAll() {
        return await db.transactions.toArray()
    }

}