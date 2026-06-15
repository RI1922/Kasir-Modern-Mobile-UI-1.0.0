import db from '../db/database'

export const productService = {

    async getAll() {
        return await db.products.toArray()
    },

    async create(data) {
        return await db.products.add(data)
    },

    async update(id, data) {
        return await db.products.update(id, data)
    },

    async delete(id) {
        return await db.products.delete(id)
    },

    async updateStock(id, stock) {

    return await db.products.update(id, {
        stock
    })

}

}