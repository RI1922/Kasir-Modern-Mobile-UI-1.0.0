import Dexie from 'dexie'

const db = new Dexie('KasirModernDB')

db.version(1).stores({

    categories: '++id,name,createdAt',

    brands: '++id,name,createdAt',

    products: `
        ++id,
        categoryId,
        brandId,
        name,
        barcode,
        purchasePrice,
        sellingPrice,
        stock,
        image,
        createdAt
    `,

    transactions: `
        ++id,
        invoice,
        total,
        profit,
        payment,
        change,
        createdAt
    `,

    transactionItems: `
        ++id,
        transactionId,
        productId,
        qty,
        price,
        subtotal
    `,

    settings: `
        ++id,
        storeName,
        address,
        phone
    `

})

export default db