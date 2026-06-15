import db from '../db/database'

export async function seedTest() {

    const total = await db.categories.count()

    if (total > 0) return

    await db.categories.add({
        name: 'ATK',
        createdAt: new Date()
    })

    console.log('Database siap')
}