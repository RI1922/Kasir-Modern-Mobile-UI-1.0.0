import db from '../db/database'

export const categoryService = {

    async getAll() {
        return await db.categories.toArray()
    },

    async create(name) {

        try {

            alert('A')

            const result = await db.categories.add({
                name,
                createdAt: new Date()
            })

            alert('B')

            return result

        } catch(err) {

            alert(
                err.name + '\n' +
                err.message
            )

            console.error(err)

            throw err

        }

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