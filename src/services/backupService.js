import db from '../db/database'
import { showSuccess }
from '../utils/toast'

export const backupService = {

    async backup() {

        try {

            const data = {

                products:
                    await db.products.toArray(),

                categories:
                    await db.categories.toArray(),

                transactions:
                    await db.transactions.toArray(),

                store_settings:

                    JSON.parse(

                        localStorage.getItem(
                            'store_settings'
                        ) || '{}'

                    ),

                backupDate:
                    new Date().toISOString()

            }

            const blob = new Blob(

                [

                    JSON.stringify(
                        data,
                        null,
                        2
                    )

                ],

                {

                    type:
                    'application/json'

                }

            )

            const link =
                document.createElement('a')

            link.href =
                URL.createObjectURL(blob)

            link.download =
                `backup-kasir-${Date.now()}.json`

            document.body.appendChild(
                link
            )

            link.click()

            document.body.removeChild(
                link
            )

            URL.revokeObjectURL(
    link.href
)

            const backupTime = new Date().toLocaleString(
    'id-ID'
)

localStorage.setItem(
    'last_backup',
    backupTime
)

console.log(
    'LAST BACKUP:',
    localStorage.getItem('last_backup')
)

            return true

        }

        catch(error){

            console.error(error)

            showError(
                'Backup gagal dibuat'
            )

            return false

        }

    },

    async restore(event) {

        const file =
            event.target.files[0]

        if(!file){

            return

        }

        const reader =
            new FileReader()

        reader.onload = async () => {

            try {

                const data =
                    JSON.parse(
                        reader.result
                    )

                await db.products.clear()

                await db.categories.clear()

                await db.transactions.clear()

                if(
                    data.products?.length
                ){

                    await db.products.bulkPut(
    data.products
)

                }

                if(
                    data.categories?.length
                ){

                    await db.categories.bulkPut(
    data.categories
)

                }

                if(
                    data.transactions?.length
                ){

                    await db.transactions.bulkPut(
    data.transactions
)

                }

                if(
                    data.store_settings
                ){

                    localStorage.setItem(

                        'store_settings',

                        JSON.stringify(
                            data.store_settings
                        )

                    )

                }

                event.target.value = ''

                location.reload()

            }

            catch(error){

                console.error(error)

showError(
    'File backup tidak valid'
)

            }

        }

        reader.readAsText(file)

    },

    async reset() {

        const confirmReset = confirm(

            'Yakin ingin menghapus seluruh data toko?'

        )

        if(!confirmReset){

            return

        }

        try {

            await db.products.clear()

            await db.categories.clear()

            await db.transactions.clear()

            localStorage.removeItem('user_account')
            localStorage.removeItem('isLoggedIn')

            localStorage.removeItem(
                'store_settings'
            )

            localStorage.removeItem(
                'last_backup'
            )

            showSuccess(
    'Semua data berhasil dihapus'
)

window.location.href = '#/login'

        }

        catch(error){

            console.error(error)

            showError(
                'Gagal menghapus data'
            )

        }

    }

}