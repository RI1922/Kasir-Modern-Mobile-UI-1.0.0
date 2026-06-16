export const settingsService = {

    getSettings(){

        const data = localStorage.getItem(
            'store_settings'
        )

        return data
            ? JSON.parse(data)
            : {

                storeName:'Kasir Modern',
                address:'',
                phone:'',
                owner:'Pemilik Toko',
                logo:''

            }

    }

}