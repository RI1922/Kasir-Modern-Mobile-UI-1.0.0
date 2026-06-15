import db from '../db/database'

export const brandService = {

    async getAll() {
        return await db.brands.toArray()
    },

    async create(name) {
        return await db.brands.add({
            name,
            createdAt: new Date()
        })
    },

    async update(id, name) {
        return await db.brands.update(id, {
            name
        })
    },

    async delete(id) {
        return await db.brands.delete(id)
    }

}