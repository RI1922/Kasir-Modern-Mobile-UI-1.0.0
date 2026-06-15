import db from '../db/database'

export const categoryService = {

    async getAll() {
        return await db.categories.toArray()
    },

    async create(name) {
        return await db.categories.add({
            name,
            createdAt: new Date()
        })
    },

    async update(id, name) {
        return await db.categories.update(id, {
            name
        })
    },

    async delete(id) {
        return await db.categories.delete(id)
    }

}